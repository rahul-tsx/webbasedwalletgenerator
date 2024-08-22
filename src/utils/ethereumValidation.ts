import { coinChain, ethPriceUrl } from '@/constants/coinUnit';
import axios from 'axios';
import { ethers, HDNodeWallet } from 'ethers';
import { Wallet } from 'ethers';

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

export const getEthBalance = async (
	pubkey: string,
	chain: EthereumChain = 'sepolia'
) => {
	try {
		const ethereumProvider = new ethers.JsonRpcProvider(
			coinChain.ethereum[chain].link
		);
		const balance = await ethereumProvider.getBalance(pubkey);
		const ethBalance = ethers.formatEther(balance);
		return Number(ethBalance);
	} catch (error) {
		console.error('Error fetching Ethereum balance:', error);
	}
};

export const sendEth = async (
	privateKey: string,
	receiverAddress: string,
	ethAmount: number,
	chain: EthereumChain = 'sepolia'
) => {
	try {
		const provider = new ethers.JsonRpcProvider(coinChain.ethereum[chain].link);
		console.log(coinChain.ethereum[chain].link);
		const wallet = new ethers.Wallet(privateKey, provider);

		const tx = {
			to: receiverAddress,
			value: ethers.parseEther(ethAmount.toString()),
		};
		const transaction = await wallet.sendTransaction(tx);
		const receipt = await transaction.wait();
		return receipt?.hash;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const getEthtoUsd = async (
	ethBalance: number,
	previousPrice: number | null = null
) => {
	try {
		const response = await axios.get(ethPriceUrl);
		const data = response.data.data;
		const currentPrice = parseFloat(data.amount);

		let percentageChange: number | null = null;
		let priceDifference: number | null = null;
		if (previousPrice !== null) {
			priceDifference = currentPrice - previousPrice;
			percentageChange = (priceDifference / previousPrice) * 100;
		}

		return {
			totalValue: ethBalance * currentPrice,
			percentageChange: percentageChange ? percentageChange.toFixed(2) : null,
			priceDifference: priceDifference ? priceDifference.toFixed(2) : null,
			currentPrice: currentPrice,
		};
	} catch (error) {
		console.error('Error fetching ETH to USD price:', error);
		return null;
	}
};
