import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Button } from '../ui/button';
import { HoverEffect } from '../ui/card-hover-effect';
import nacl from 'tweetnacl';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import CoinKey from 'coinkey';
import bitcoin from 'bitcoinjs-lib';
import HDKey from 'hdkey';
import { deriveEthereumWallet } from '@/utils/ethereumValidation';

import {
	ModalBody,
	ModalContent,
	ModalFooter,
	useModal,
} from '@/components/ui/animated-modal';
import CreateWalletForm from './CreateWalletForm';
import AlertBox from '../AlertBox';

interface WalletsSectionProps {
	mnemonic: string;
	setStatus: Dispatch<SetStateAction<string | null>>;
}

const WalletsSection: FC<WalletsSectionProps> = ({ mnemonic, setStatus }) => {
	const [wallets, setWallets] = useState<Wallet[]>([]);
	const [index, setIndex] = useState(0);
	const { setOpen } = useModal();
	const formRef = useRef<HTMLButtonElement>(null);
	const [deleteAlert, setDeleteAlert] = useState(false);
	const [deleteWalletPubkey, setDeleteWalletPubkey] = useState<string | null>(
		null
	);

	const triggerWalletBox = () => {
		setOpen(true);
	};
	const triggerDeleteWallet = (publicKey: string) => {
		setDeleteWalletPubkey(publicKey);
		setDeleteAlert(true);
	};
	const handleDeleteConfirm = () => {
		if (deleteWalletPubkey) deleteWalletByPublicKey(deleteWalletPubkey);

		setStatus('Wallet Deleted');
		setDeleteWalletPubkey(null);
	};

	const handleSubmitClick = () => {
		if (formRef.current) {
			formRef.current.click();
		}
	};

	// const deriveWallet = ({
	// 	mnemonic,
	// 	coinType = 'solana',
	// 	walletName = `Wallet ${index + 1}`,
	// }: {
	// 	mnemonic: string;
	// 	coinType: string;
	// 	walletName: string;
	// }) => {
	// 	const seed = mnemonicToSeedSync(mnemonic);

	// 	const paths = {
	// 		solana: `m/44'/501'/${index}'/0'`,
	// 		ethereum: `m/44'/60'/0'/0/${index}`,
	// 		bitcoin: `m/44'/0'/${index}'/0/0`,
	// 	};

	// 	let publicKey, privateKey;

	// 	if (coinType === 'solana') {
	// 		const path = paths[coinType];
	// 		const derivedSeed = derivePath(path, seed.toString('hex')).key;
	// 		const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);
	// 		privateKey = Buffer.from(keypair.secretKey).toString('hex');
	// 		publicKey = Keypair.fromSecretKey(keypair.secretKey).publicKey.toBase58();
	// 	} else if (coinType === 'ethereum') {
	// 		const ethereumWallet = deriveEthereumWallet(seed, paths.ethereum);
	// 		privateKey = ethereumWallet.privateKey;
	// 		publicKey = ethereumWallet.address;
	// 	} else if (coinType === 'bitcoin') {
	// 		const path = paths.bitcoin;
	// 		const hdKey = HDKey.fromMasterSeed(Buffer.from(seed));
	// 		const child = hdKey.derive(path);
	// 		const ck = new CoinKey(child.privateKey, bitcoin.networks.bitcoin);
	// 		publicKey = ck.publicAddress;
	// 		privateKey = ck.privateKey.toString('hex');
	// 	}

	// 	const newWallet = {
	// 		publicKey,
	// 		privateKey,
	// 		coinType,
	// 		name: walletName,
	// 	};

	// 	const existingWallets = JSON.parse(localStorage.getItem('wallets') || '[]');
	// 	const updatedWallets = [...existingWallets, newWallet];
	// 	localStorage.setItem('wallets', JSON.stringify(updatedWallets));

	// 	setWallets(updatedWallets);
	// 	setIndex(index + 1);
	// 	setOpen(false);
	// };

	const deriveWallet = ({
		mnemonic,
		coinType = 'solana',
		walletName = `Wallet ${index + 1}`,
	}: {
		mnemonic: string;
		coinType: string;
		walletName: string;
	}) => {
		const seed = mnemonicToSeedSync(mnemonic);

		let tempIndex = index; // Use a temporary index variable for trial and error
		const paths = {
			solana: `m/44'/501'/${tempIndex}'/0'`,
			ethereum: `m/44'/60'/0'/0/${tempIndex}`,
			bitcoin: `m/44'/0'/${tempIndex}'/0/0`,
		};

		// Initialize publicKey and privateKey to avoid the 'used before assigned' error
		let publicKey: string = '';
		let privateKey: string = '';
		let newWallet: any;
		let existingWallets = JSON.parse(localStorage.getItem('wallets') || '[]');
		let isDuplicate = true;

		// Loop until a unique public key is found
		while (isDuplicate) {
			if (coinType === 'solana') {
				const path = paths[coinType];
				const derivedSeed = derivePath(path, seed.toString('hex')).key;
				const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);
				privateKey = Buffer.from(keypair.secretKey).toString('hex');
				publicKey = Keypair.fromSecretKey(
					keypair.secretKey
				).publicKey.toBase58();
			} else if (coinType === 'ethereum') {
				const ethereumWallet = deriveEthereumWallet(seed, paths.ethereum);
				privateKey = ethereumWallet.privateKey;
				publicKey = ethereumWallet.address;
			} else if (coinType === 'bitcoin') {
				const path = paths.bitcoin;
				const hdKey = HDKey.fromMasterSeed(Buffer.from(seed));
				const child = hdKey.derive(path);
				const ck = new CoinKey(child.privateKey, bitcoin.networks);
				publicKey = ck.publicAddress;
				privateKey = ck.privateKey.toString('hex');
			}

			newWallet = {
				publicKey,
				privateKey,
				coinType,
				name: walletName,
			};

			// Check if the public key already exists in the wallet list
			isDuplicate = existingWallets.some(
				(wallet: Wallet) => wallet.publicKey === publicKey
			);

			if (isDuplicate) {
				// Increment the tempIndex if a duplicate is found and update the paths
				tempIndex++;
				paths.solana = `m/44'/501'/${tempIndex}'/0'`;
				paths.ethereum = `m/44'/60'/0'/0/${tempIndex}`;
				paths.bitcoin = `m/44'/0'/${tempIndex}'/0/0`;
			}
		}

		// Store the new wallet in local storage
		const updatedWallets = [...existingWallets, newWallet];
		localStorage.setItem('wallets', JSON.stringify(updatedWallets));

		// Update state
		setWallets(updatedWallets);
		setIndex(tempIndex + 1); // Update the actual index state only after finding a unique wallet
		setOpen(false);
	};

	const retrieveWallets = () => {
		const storedWallets = JSON.parse(localStorage.getItem('wallets') || '[]');
		setWallets(storedWallets);
		setIndex(storedWallets.length);
	};

	// Function to rename a wallet
	const renameWallet = (index: number, newName: string) => {
		const updatedWallets = wallets.map((wallet, idx) =>
			idx === index ? { ...wallet, name: newName } : wallet
		);
		setWallets(updatedWallets);
		localStorage.setItem('wallets', JSON.stringify(updatedWallets));
	};
	const deleteWalletByPublicKey = (publicKey: string) => {
		const wallets: Wallet[] = JSON.parse(
			localStorage.getItem('wallets') || '[]'
		);
		const updatedWallets = wallets.filter(
			(wallet) => wallet.publicKey !== publicKey
		);
		localStorage.setItem('wallets', JSON.stringify(updatedWallets));
		retrieveWallets();
	};
	useEffect(() => {
		retrieveWallets();
	}, []);

	return (
		<main className='grid grid-cols-7 w-full'>
			<div className='grid col-span-7 grid-cols-7 gap-10 items-center'>
				<h1 className='text-3xl font-semibold col-span-4 w-full'>
					Your Wallets
				</h1>
				<Button
					className='col-start-6 col-span-2 rounded-[6px]'
					onClick={triggerWalletBox}>
					Add Wallet
				</Button>
			</div>

			<HoverEffect
				items={wallets}
				setStatus={setStatus}
				deleteWallet={(publicKey: string) => triggerDeleteWallet(publicKey)}
			/>
			<ModalBody className=''>
				<ModalContent className='gap-5 bg-slate-800 '>
					<div className='flex flex-col justify-between '>
						<h1 className='text-lg lg:text-2xl font-bold '>
							Create a new Wallet
						</h1>

						<CreateWalletForm
							ref={formRef}
							defaultSecretPhrase={mnemonic}
							index={index + 1}
							createWallet={({ mnemonic, coinType, walletName }) =>
								deriveWallet({ mnemonic, coinType, walletName })
							}
						/>
					</div>
				</ModalContent>
				<ModalFooter className='gap-4 grid grid-cols-4 '>
					<button
						onClick={() => setOpen(false)}
						className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm text-center col-start-3'>
						Cancel
					</button>
					<button
						onClick={handleSubmitClick}
						className='px-3 py-2 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm  text-center'>
						Create Wallet
					</button>
				</ModalFooter>
			</ModalBody>
			<AlertBox
				open={deleteAlert}
				setOpen={setDeleteAlert}
				title='Are you sure you want to delete this wallet?'
				description='This is a destructive action and you cannot access your wallet back without your secret phrase'
				onConfirm={handleDeleteConfirm}
				onCancel={() => setDeleteWalletPubkey(null)}
			/>
		</main>
	);
};

export default WalletsSection;
