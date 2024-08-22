import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Button } from '../ui/button';
import { mnemonicToSeedSync } from 'bip39';
import { deriveEthereumWallet } from '@/utils/ethereumValidation';

import { useModal } from '@/components/ui/animated-modal';
import { v4 as uuidv4 } from 'uuid';
import AlertBox from '../AlertBox';
import { deriveSolanaWallet } from '@/utils/solanaValidation';
import WalletList from './WalletList';
import AddNewWalletModal from './AddNewWalletModal';

interface WalletsSectionProps {
	mnemonic: string;
	setStatus: (message: string, variant?: variantTypes) => void;
}

const WalletsSection: FC<WalletsSectionProps> = ({ mnemonic, setStatus }) => {
	const [wallets, setWallets] = useState<Wallet[]>([]);
	const [index, setIndex] = useState(0);
	const { closeModal, isOpen, openModal } = useModal('AddWalletModal');
	const formRef = useRef<HTMLButtonElement>(null);
	const [deleteAlert, setDeleteAlert] = useState(false);
	const [deleteWalletPubkey, setDeleteWalletPubkey] = useState<string | null>(
		null
	);

	const triggerWalletBox = () => {
		openModal();
	};
	const triggerDeleteWallet = (publicKey: string) => {
		setDeleteWalletPubkey(publicKey);
		setDeleteAlert(true);
	};
	const handleDeleteConfirm = () => {
		if (deleteWalletPubkey) deleteWalletByPublicKey(deleteWalletPubkey);

		setStatus('Wallet Deleted', 'warning');
		setDeleteWalletPubkey(null);
	};

	const handleSubmitClick = () => {
		if (formRef.current) {
			formRef.current.click();
		}
	};

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

		let tempIndex = index;
		const paths = {
			solana: `m/44'/501'/${tempIndex}'/0'`,
			ethereum: `m/44'/60'/0'/0/${tempIndex}`,
			bitcoin: `m/44'/0'/${tempIndex}'/0/0`,
		};

		let publicKey: string = '';
		let privateKey: string = '';
		let newWallet: any;
		let existingWallets = JSON.parse(localStorage.getItem('wallets') || '[]');
		let isDuplicate = true;

		// Loop until a unique public key is found
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
				paths.solana = `m/44'/501'/${tempIndex}'/0'`;
				paths.ethereum = `m/44'/60'/0'/0/${tempIndex}`;
				paths.bitcoin = `m/44'/0'/${tempIndex}'/0/0`;
			}
		}

		const updatedWallets = [...existingWallets, newWallet];
		localStorage.setItem('wallets', JSON.stringify(updatedWallets));

		setWallets(updatedWallets);
		setIndex(tempIndex + 1);
		closeModal();
	};

	const retrieveWallets = () => {
		const storedWallets = JSON.parse(localStorage.getItem('wallets') || '[]');
		setWallets(storedWallets);
	};

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
			<WalletList
				setStatus={setStatus}
				triggerDeleteWallet={triggerDeleteWallet}
				wallets={wallets}
			/>{' '}
			<AddNewWalletModal
				id='AddWalletModal'
				deriveWallet={deriveWallet}
				formRef={formRef}
				handleSubmitClick={handleSubmitClick}
				index={index}
				mnemonic={mnemonic}
				closeModal={closeModal}
			/>
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
