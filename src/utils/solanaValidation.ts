
import nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import bs58 from 'bs58';
import axios from 'axios';
import web3, {
	clusterApiUrl,
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
	sendAndConfirmTransaction,
	SystemProgram,
	Transaction,
	Message,
} from '@solana/web3.js';

import {
	createInitializeMetadataPointerInstruction,
	createInitializeMintInstruction,
	createMint,
	createTransferInstruction,
	ExtensionType,
	getAccount,
	getMint,
	getMintLen,
	getOrCreateAssociatedTokenAccount,
	getTokenMetadata,
	LENGTH_SIZE,
	mintTo,
	TOKEN_2022_PROGRAM_ID,
	transfer,
	TYPE_SIZE,
} from '@solana/spl-token';

import {
	createInitializeInstruction,
	createUpdateFieldInstruction,
	createRemoveKeyInstruction,
	pack,
	TokenMetadata,
} from '@solana/spl-token-metadata';
//@ts-ignore
import { SYSTEM_INSTRUCTION_LAYOUTS } from '@solana/web3.js';
import { coinChain, solPriceUrl } from '@/lib/constants';

export const deriveSolanaWallet = (
	path: string,
	seed: Buffer
): { privateKey: string; publicKey: string } => {
	const derivedSeed = derivePath(path, seed.toString('hex')).key;
	const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);
	const privateKey = bs58.encode(Buffer.from(keypair.secretKey));
	const publicKey = Keypair.fromSecretKey(
		keypair.secretKey
	).publicKey.toBase58();
	return { privateKey, publicKey };
};

export const getSolBalance = async (
	pubKey: string,
	chain: SolanaChain = 'devnet'
) => {
	try {
		const solanaPublicKey = new PublicKey(pubKey);

		const connection = new Connection(
			coinChain.solana[chain].link,
			'confirmed'
		);

		const walletBalance = await connection.getBalance(solanaPublicKey);
		return walletBalance / LAMPORTS_PER_SOL;
	} catch (error) {
		console.log(error);
	}
};

export const solDrop = async (
	pubKey: string,
	chain: SolanaChain = 'devnet'
) => {
	try {
		const connection = new Connection(
			coinChain.solana[chain].link,
			'confirmed'
		);
		console.log(`-- Airdropping 2 SOL --`);
		const signature = await connection.requestAirdrop(
			new PublicKey(pubKey),
			2 * LAMPORTS_PER_SOL
		);
		const latestBlockHash = await connection.getLatestBlockhash();

		const value = await connection.confirmTransaction({
			blockhash: latestBlockHash.blockhash,
			lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
			signature: signature,
		});
		return 'Drop Successful:' + signature;
	} catch (err) {
		throw err;
	}
};

export const sendSol = async (
	privKey: string,
	receiverPublicKey: string,
	solAmount: number,
	chain: SolanaChain = 'devnet'
) => {
	try {
		const connection = new Connection(
			coinChain.solana[chain].link,
			'confirmed'
		);
		const privateKey = bs58.decode(privKey);
		const receiverPubKey = new PublicKey(receiverPublicKey);
		const senderAddress = Keypair.fromSecretKey(privateKey);
		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: senderAddress.publicKey,
				toPubkey: receiverPubKey,
				lamports: solAmount * LAMPORTS_PER_SOL,
			})
		);
		const signature = await sendAndConfirmTransaction(connection, transaction, [
			senderAddress,
		]);

		return signature;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const checkNetworkFees = async (
	payerPubKey: string,
	receiverPubKey: string,
	chain: SolanaChain = 'devnet'
) => {
	const connection = new Connection(coinChain.solana[chain].link, 'confirmed');

	const type = SYSTEM_INSTRUCTION_LAYOUTS.Transfer;

	const data = Buffer.alloc(type.layout.span);
	const layoutFields = Object.assign({ instruction: type.index });
	type.layout.encode(layoutFields, data);

	const recentBlockhash = await connection.getLatestBlockhash();

	const messageParams = {
		accountKeys: [
			payerPubKey,
			receiverPubKey,
			SystemProgram.programId.toString(),
		],
		header: {
			numReadonlySignedAccounts: 0,
			numReadonlyUnsignedAccounts: 1,
			numRequiredSignatures: 1,
		},
		instructions: [
			{
				accounts: [0, 1],
				data: bs58.encode(data),
				programIdIndex: 2,
			},
		],
		recentBlockhash: recentBlockhash.blockhash,
	};

	const message = new Message(messageParams);

	const fees = await connection.getFeeForMessage(message);
	console.log(`Estimated SOL transfer cost: ${fees.value} lamports`);
	return fees.value;
};

export const getSoltoUsd = async (
	solBalance: number,
	previousPrice: number | null = null
) => {
	try {
		const response = await axios.get(solPriceUrl);
		const data = response.data.data;
		const currentPrice = parseFloat(data.amount);

		let percentageChange: number | null = null;
		let priceDifference: number | null = null;
		if (previousPrice !== null) {
			priceDifference = currentPrice - previousPrice;
			percentageChange = (priceDifference / previousPrice) * 100;
		}

		return {
			totalValue: solBalance * currentPrice,
			percentageChange: percentageChange ? percentageChange.toFixed(2) : null,
			priceDifference: priceDifference ? priceDifference.toFixed(2) : null,
			currentPrice: currentPrice,
		};
	} catch (error) {
		console.error('Error fetching SOL to USD price:', error);
		return null;
	}
};
//Not using
export const createToken = async (
	connection: Connection,
	payerAddress: Keypair,
	mintAuthority: PublicKey,
	decimals: number
) => {
	const mint = await createMint(
		connection,
		payerAddress,
		mintAuthority,
		null,
		decimals,
		undefined,
		undefined,
		TOKEN_2022_PROGRAM_ID
	);
	console.log('Mint created at ', mint.toBase58());
	return mint.toBase58();
};

export const mintToken = async (
	connection: Connection,
	payerAddress: Keypair,
	mint: PublicKey,
	mintAuthority: PublicKey,
	amount: number
) => {
	const tokenAccount = await getOrCreateAssociatedTokenAccount(
		connection,
		payerAddress,
		new PublicKey(mint),
		payerAddress.publicKey,
		undefined,
		'finalized',
		undefined,
		TOKEN_2022_PROGRAM_ID
	);
	await mintTo(
		connection,
		payerAddress,
		new PublicKey(mint),
		tokenAccount.address,
		mintAuthority,
		amount,
		undefined,
		{ commitment: 'finalized', maxRetries: 5 },
		TOKEN_2022_PROGRAM_ID
	);
	console.log('Minted', amount, 'tokens to', tokenAccount.address.toBase58());
};

const addMetadata = async (
	connection: Connection,
	tokenName: string,
	tokenSymbol: string,
	tokenMetadataURI: string = 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
	payer: Keypair,
	decimals: number
) => {
	const mintKeypair = Keypair.generate();

	const mint = mintKeypair.publicKey;
	const metadata: TokenMetadata = {
		mint: mint,
		name: tokenName,
		symbol: tokenSymbol,
		uri: tokenMetadataURI,
		additionalMetadata: [],
	};

	const mintLen = getMintLen([ExtensionType.MetadataPointer]);
	const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
	const mintLamports = await connection.getMinimumBalanceForRentExemption(
		mintLen + metadataLen
	);
	const mintTransaction = new Transaction().add(
		SystemProgram.createAccount({
			fromPubkey: payer.publicKey,
			newAccountPubkey: mint,
			space: mintLen,
			lamports: mintLamports,
			programId: TOKEN_2022_PROGRAM_ID,
		}),
		createInitializeMetadataPointerInstruction(
			mint,
			payer.publicKey,
			mint,
			TOKEN_2022_PROGRAM_ID
		),
		createInitializeMintInstruction(
			mint,
			decimals,
			payer.publicKey,
			null,
			TOKEN_2022_PROGRAM_ID
		),
		createInitializeInstruction({
			programId: TOKEN_2022_PROGRAM_ID,
			mint: mint,
			metadata: mint,
			name: metadata.name,
			symbol: metadata.symbol,
			uri: metadata.uri,
			mintAuthority: payer.publicKey,
			updateAuthority: payer.publicKey,
		})
	);
	const trasnactionSig = await sendAndConfirmTransaction(
		connection,
		mintTransaction,
		[payer, mintKeypair],
		{ commitment: 'finalized' }
	);
	return { transactionSig: trasnactionSig, mintAddress: mintKeypair };
};
export const validateSolanaAddress = (inputAddress: string) => {
	if (inputAddress.length !== 43 && inputAddress.length !== 44) {
		return false;
	}
	try {
		new PublicKey(inputAddress);
		return true;
	} catch (error) {
		console.error('Address validation error:', error);
		return false;
	}
};
export const createTokenAndMint = async (
	privKey: string,
	amount: number,
	tokenname: string,
	tokenSymbol: string,
	metadataURI: string,
	decimals: number,
	chain: SolanaChain
) => {
	//Initial Config
	const connection = new Connection(coinChain.solana[chain].link, 'confirmed');
	const privateKey = bs58.decode(privKey);
	const payerAddress = Keypair.fromSecretKey(privateKey);
	const mintAuthority = payerAddress;
	try {
		const metadata = await addMetadata(
			connection,
			tokenname,
			tokenSymbol,
			metadataURI,
			payerAddress,
			decimals
		);
		await mintToken(
			connection,
			payerAddress,
			metadata.mintAddress.publicKey,
			mintAuthority.publicKey,
			amount * parseInt('1'.padEnd(decimals + 1, '0'))
		);
		return metadata.mintAddress.publicKey.toBase58();
	} catch (error) {
		console.log(error);
		throw 'Something went wrong';
	}
};

export const getAccountTokens = async (
	pubkey: string,
	chain: SolanaChain
): Promise<TokenData[] | null> => {
	const connection = new Connection(coinChain.solana[chain].link, 'confirmed');
	const tokens = await connection.getParsedTokenAccountsByOwner(
		new PublicKey(pubkey),
		{
			programId: new PublicKey(TOKEN_2022_PROGRAM_ID),
		}
	);
	const tokenArray: { mint: string; amount: string }[] = tokens.value.map(
		(token) => {
			return {
				mint: token.account.data.parsed.info.mint,
				amount: token.account.data.parsed.info.tokenAmount.uiAmountString,
			};
		}
	);
	if (!tokenArray || tokenArray.length === 0) return null;
	const tokenData = await Promise.all(
		tokenArray.map(async (mintAddress) => {
			const tokenMetadataInfo = await getTokenMetadata(
				connection,
				new PublicKey(mintAddress.mint),
				undefined,
				TOKEN_2022_PROGRAM_ID
			);
			let imageUrl: string | null = null;
			if (tokenMetadataInfo?.uri) {
				try {
					const response = await axios.get(tokenMetadataInfo.uri);

					const metadata = response.data;

					imageUrl = metadata.image;
				} catch (error) {
					console.error('Error fetching metadata with axios:', error);
				}
			}

			return { mintAddress, tokenMetadataInfo, imageUrl };
		})
	);

	return tokenData;
};
const getMintInfo = async (
	mintAddress: PublicKey,
	connection: Connection
): Promise<number> => {
	const mintInfo = await getMint(
		connection,
		mintAddress,
		undefined,
		TOKEN_2022_PROGRAM_ID
	);
	return mintInfo.decimals;
};

export const transferMintedToken = async (
	chain: SolanaChain = 'devnet',
	privKey: string,
	receiverPublicKey: string,
	mintAddress: string,
	amount: number
) => {
	try {
		const connection = new Connection(
			coinChain.solana[chain].link,
			'confirmed'
		);
		const privateKey = bs58.decode(privKey);
		const receiverPubKey = new PublicKey(receiverPublicKey);
		const mint = new PublicKey(mintAddress);
		const fromWallet = Keypair.fromSecretKey(privateKey);
		const decimals = await getMintInfo(mint, connection);

		const toTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fromWallet,
			new PublicKey(mint),
			receiverPubKey,
			undefined,
			'finalized',
			{ maxRetries: 5, commitment: 'finalized' },
			TOKEN_2022_PROGRAM_ID
		);
		const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fromWallet,
			mint,
			fromWallet.publicKey,
			undefined,
			'finalized',
			{ maxRetries: 5 },
			TOKEN_2022_PROGRAM_ID
		);


		let signature = await transfer(
			connection,
			fromWallet,
			fromTokenAccount.address,
			toTokenAccount.address,
			fromWallet.publicKey,
			parseInt('1'.padEnd(decimals + 1, '0')) * amount,
			undefined,
			{ commitment: 'finalized' },
			TOKEN_2022_PROGRAM_ID
		);

		return signature;
	} catch (error) {
		console.log(error);
		throw 'Something went wrong while transferring tokens';
	}
};
