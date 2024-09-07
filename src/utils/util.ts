import { basePaths } from '@/lib/constants';
import { mnemonicToSeedSync } from 'bip39';
import { deriveSolanaWallet, getSolBalance } from './solanaValidation';
import { deriveEthereumWallet, getEthBalance } from './ethereumValidation';
import { v4 as uuidv4 } from 'uuid';

export const deriveWallet = (
	mnemonic: string,
	coinType: coinTypes = 'solana',
	index: number = 0,
	walletName: string = `Wallet ${index + 1}`
) => {
	const seed = mnemonicToSeedSync(mnemonic);

	let tempIndex = index;
	const paths = {
		solana: basePaths.solana.replace('x', tempIndex.toString()),
		ethereum: basePaths.ethereum.replace('x', tempIndex.toString()),
		bitcoin: basePaths.bitcoin.replace('x', tempIndex.toString()),
	};

	let publicKey: string = '';
	let privateKey: string = '';
	let newWallet: any;
	let existingWallets = JSON.parse(localStorage.getItem('wallets') || '[]');
	let isDuplicate = true;

	while (isDuplicate) {
		if (coinType === 'solana') {
			const path = paths[coinType];
			const solwallet = deriveSolanaWallet(path, seed);
			privateKey = solwallet.privateKey;
			publicKey = solwallet.publicKey;
		} else if (coinType === 'ethereum') {
			const ethereumWallet = deriveEthereumWallet(seed, paths.ethereum);
			privateKey = ethereumWallet.privateKey;
			publicKey = ethereumWallet.address;
		} else if (coinType === 'bitcoin') {
			// const path = paths.bitcoin;
			// const hdKey = HDKey.fromMasterSeed(Buffer.from(seed));
			// const child = hdKey.derive(path);
			// const ck = new CoinKey(child.privateKey, bitcoin.networks);
			// publicKey = ck.publicAddress;
			// privateKey = ck.privateKey.toString('hex');
		}

		newWallet = {
			publicKey,
			privateKey,
			coinType,
			name: walletName,
			id: uuidv4(),
			pathIndex: tempIndex,
			slug: walletName
				.replace(' ', '_')
				.concat('_')
				.concat(coinType)
				.toLowerCase(),
		};

		isDuplicate = existingWallets.some(
			(wallet: Wallet) => wallet.publicKey === publicKey
		);

		if (isDuplicate) {
			tempIndex++;
			paths.solana = basePaths.solana.replace('x', tempIndex.toString());
			paths.ethereum = basePaths.ethereum.replace('x', tempIndex.toString());
			paths.bitcoin = basePaths.bitcoin.replace('x', tempIndex.toString());
		}
	}

	const updatedWallets: Wallet[] = [...existingWallets, newWallet];
	localStorage.setItem('wallets', JSON.stringify(updatedWallets));
	return {
		updatedWallets,
		index: tempIndex + 1,
	};
};
export type previewObject = {
	pubkey: string;
	balance: number;
	index: number;
	coin: coinTypes;
};

export interface walletPreviewReturn {
	solWalletPreview: previewObject[];
	ethWalletPreview: previewObject[];
}

export const walletPreview = async (
	mnemonic: string,
	index?: number
): Promise<walletPreviewReturn> => {
	const seed = mnemonicToSeedSync(mnemonic);

	let publicKey: string = '';
	let privateKey: string = '';
	let solWalletPreview: previewObject[] = [];
	let ethWalletPreview: previewObject[] = [];
	if (index) {
		const solwallet = deriveSolanaWallet(
			basePaths.solana.replace('x', index.toString()),
			seed
		);
		privateKey = solwallet.privateKey;
		publicKey = solwallet.publicKey;
		const solBalance = await getSolBalance(publicKey);
		solWalletPreview.push({
			pubkey: publicKey,
			balance: solBalance || 0,
			index,
			coin: 'solana',
		});
		const ethereumWallet = deriveEthereumWallet(
			seed,
			basePaths.ethereum.replace('x', index.toString())
		);
		privateKey = ethereumWallet.privateKey;
		publicKey = ethereumWallet.address;
		const ethBalance = await getEthBalance(publicKey);
		ethWalletPreview.push({
			pubkey: publicKey,
			balance: ethBalance || 0,
			index,
			coin: 'ethereum',
		});
		return { solWalletPreview, ethWalletPreview };
	}
	for (let i = 0; i <= 5; i++) {
		const solwallet = deriveSolanaWallet(
			basePaths.solana.replace('x', i.toString()),
			seed
		);
		privateKey = solwallet.privateKey;
		publicKey = solwallet.publicKey;
		const solBalance = await getSolBalance(publicKey);
		solWalletPreview.push({
			pubkey: publicKey,
			balance: solBalance || 0,
			index: i,
			coin: 'solana',
		});
	}
	for (let i = 0; i <= 5; i++) {
		const ethereumWallet = deriveEthereumWallet(
			seed,
			basePaths.ethereum.replace('x', i.toString())
		);
		privateKey = ethereumWallet.privateKey;
		publicKey = ethereumWallet.address;
		const ethBalance = await getEthBalance(publicKey);
		ethWalletPreview.push({
			pubkey: publicKey,
			balance: ethBalance || 0,
			index: i,
			coin: 'ethereum',
		});
	}
	
	return { solWalletPreview, ethWalletPreview };
};
