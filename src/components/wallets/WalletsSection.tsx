import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { HoverEffect } from '../ui/card-hover-effect';
import nacl from 'tweetnacl';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import { ethers } from 'ethers'; // Import ethers.js for Ethereum keypair generation
import CoinKey from 'coinkey'; // Import coinkey for Bitcoin keypair generation
import { deriveEthereumWallet } from '@/utils/ethereumValidation';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalProvider,
	ModalTrigger,
	useModal,
} from '@/components/ui/animated-modal';
import CreateWalletForm from './CreateWalletForm';

interface WalletsSectionProps {
	mnemonic: string;
	setStatus: Dispatch<SetStateAction<string | null>>;
}

const WalletsSection: FC<WalletsSectionProps> = ({ mnemonic, setStatus }) => {
	const [wallets, setWallets] = useState<Wallet[]>([]);
	const [index, setIndex] = useState(0);
	const { setOpen } = useModal();
	const formRef = useRef<HTMLButtonElement>(null);

	const triggerWalletBox = () => {
		setOpen(true);
	};
	const handleConfirm = () => {};
	const handleSubmitClick = () => {
		if (formRef.current) {
			formRef.current.click();
			setOpen(false);
		}
	};

	const deriveWallet = ({
		mnemonic,
		coinType = 'solana', // default to Solana
		walletName = `Wallet ${index + 1}`,
	}: {
		mnemonic: string;
		coinType: string;
		walletName: string;
	}) => {
		console.log('hello');
		const seed = mnemonicToSeedSync(mnemonic);

		// Define paths for different coin types
		const paths = {
			solana: `m/44'/501'/${index}'/0'`,
			ethereum: `m/44'/60'/0'/0/${index}`,
			bitcoin: `m/44'/0'/${index}'/0/0`,
		};

		let publicKey, privateKey;

		if (coinType === 'solana') {
			const path = paths[coinType];
			const derivedSeed = derivePath(path, seed.toString('hex')).key;
			const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);
			privateKey = Buffer.from(keypair.secretKey).toString('hex');
			publicKey = Keypair.fromSecretKey(keypair.secretKey).publicKey.toBase58();
		} else if (coinType === 'ethereum') {
			const ethereumWallet = deriveEthereumWallet(seed, paths.ethereum);
			privateKey = ethereumWallet.privateKey;
			publicKey = ethereumWallet.address;
		} else if (coinType === 'bitcoin') {
			const path = paths.bitcoin;
			const derivedSeed = derivePath(path, seed.toString('hex')).key;
			const ck = new CoinKey(derivedSeed, { compressed: true });
			publicKey = ck.publicAddress;
			privateKey = ck.privateKey.toString('hex');
		}

		const newWallet = {
			publicKey,
			privateKey,
			coinType,
			name: walletName,
		};

		// Store the wallet in local storage
		const existingWallets = JSON.parse(localStorage.getItem('wallets') || '[]');
		const updatedWallets = [...existingWallets, newWallet];
		localStorage.setItem('wallets', JSON.stringify(updatedWallets));

		// Update state
		setWallets(updatedWallets);
		setIndex(index + 1);
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
			/>
			<ModalBody>
				<ModalContent className='gap-5'>
					<div className='flex flex-col justify-between'>
						<h1 className='text-lg lg:text-2xl font-bold'>
							Create a new Wallet
						</h1>
						{/* <div className='flex my-5 gap-5'>

							<RadioGroup
								defaultValue='solana'
								className='flex'>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem
										value='solana'
										id='solana'
									/>
									<Label htmlFor='solana'>Solana</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem
										value='ethereum'
										id='ethereum'
									/>
									<Label htmlFor='ethereum'>Ethereum</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem
										value='bitcoin'
										id='bitcoin'
									/>
									<Label htmlFor='bitcoin'>Bitcoin</Label>
								</div>
							</RadioGroup>
						</div> */}
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
				<ModalFooter className='gap-4 '>
					<button
						onClick={handleSubmitClick}
						className='px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
						Create Wallet
					</button>
				</ModalFooter>
			</ModalBody>
		</main>
	);
};

export default WalletsSection;
