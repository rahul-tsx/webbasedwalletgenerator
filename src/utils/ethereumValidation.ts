import { ethers, HDNodeWallet } from 'ethers';
import { Wallet } from 'ethers';

export const EthereumConnectionUrl = {
	SEPOLIA: process.env.NEXT_PUBLIC_ETH_PROVIDER_URL,
};

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

export function getEthereumWallet(privateKey: string): Wallet {
	let wallet: Wallet;
	try {
		wallet = new Wallet(privateKey);
	} catch {
		throw new Error('Invalid Ethereum private key');
	}
	return wallet;
}

export const getEthBalance = async (pubkey: string) => {
	try {
		const ethereumProvider = new ethers.JsonRpcProvider(
			EthereumConnectionUrl.SEPOLIA
		);
		const balance = await ethereumProvider.getBalance(pubkey);
		const ethBalance = ethers.formatEther(balance);
		return Number(ethBalance);
	} catch (error) {
		console.error('Error fetching Ethereum balance:', error);
	}
};
