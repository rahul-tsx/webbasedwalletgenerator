import nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import bs58 from 'bs58';
import {
	clusterApiUrl,
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
} from '@solana/web3.js';

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
