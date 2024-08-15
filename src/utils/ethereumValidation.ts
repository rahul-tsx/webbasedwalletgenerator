import { HDNodeWallet } from "ethers";
import { Wallet } from "ethers";

export function deriveEthereumWallet(
	seed: Buffer,
	derivationPath: string
): Wallet {
	const privateKey = deriveEthereumPrivateKey(seed, derivationPath);
	return new Wallet(privateKey);
}

export function deriveEthereumPrivateKey(
	seed: Buffer,
	derivationPath: string
): string {
	const hdNode = HDNodeWallet.fromSeed(seed);
	const child = hdNode.derivePath(derivationPath);
	return child.privateKey;
}

/**
 * Validate an Ethereum private key
 */
export function getEthereumWallet(privateKey: string): Wallet {
	let wallet: Wallet;
	try {
		wallet = new Wallet(privateKey);
	} catch {
		throw new Error('Invalid Ethereum private key');
	}
	return wallet;
}
