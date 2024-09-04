import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Button } from '../ui/button';

import { useModal } from '@/components/ui/animated-modal';
import AlertBox from '../AlertBox';

import WalletList from './WalletList';
import AddNewWalletModal from './AddNewWalletModal';
import { deriveWallet } from '@/utils/util';
import { decryptMnemonic } from '@/utils/handleSecretKey';
import { useAuthStore } from '@/store/auth';

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
	const { localPassword } = useAuthStore();
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

	const createNewWallet = ({
		coinType = 'solana',
		walletName,
	}: {
		coinType: string;
		walletName: string;
	}) => {
		const storedEncryptedMnemonic = localStorage.getItem('encryptedMnemonic');

		if (!storedEncryptedMnemonic) {
			setStatus('Menumonic Deleted create new one', 'warning');
			return;
		}

		const decryptedMnemonic = decryptMnemonic(
			storedEncryptedMnemonic,
			localPassword!
		);

		const { index: currentIndex, updatedWallets } = deriveWallet(
			decryptedMnemonic!,
			coinType,
			index,
			walletName
		);

		setWallets(updatedWallets);
		setIndex(currentIndex);
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
				isOpen={isOpen}
				deriveWallet={createNewWallet}
				formRef={formRef}
				handleSubmitClick={handleSubmitClick}
				index={index}
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
