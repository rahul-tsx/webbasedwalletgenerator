import { solPriceUrl } from './../constants/coinUnit';
import nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import bs58 from 'bs58';
import axios from 'axios';
import {
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
//@ts-ignore
import { SYSTEM_INSTRUCTION_LAYOUTS } from '@solana/web3.js';

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

export const getSolBalance = async (pubKey: string) => {
	try {
		const solanaPublicKey = new PublicKey(pubKey);
		const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
		const walletBalance = await connection.getBalance(solanaPublicKey);
		return walletBalance / LAMPORTS_PER_SOL;
	} catch (error) {
		console.log(error);
	}
};

export const solDrop = async (pubKey: string) => {
	try {
		const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
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
	solAmount: number
) => {
	try {
		const connection = new Connection(clusterApiUrl('devnet'));
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
	receiverPubKey: string
) => {
	const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

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
	previousPrice: number | null=null
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

		console.log(`Current Price: $${currentPrice}`);
		if (percentageChange !== null) {
			console.log(`Percentage Change: ${percentageChange.toFixed(2)}%`);
			console.log(`Price Difference: $${priceDifference?.toFixed(2)}`);
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
