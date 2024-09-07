import {
	useState,
	useEffect,
	FC,
	RefObject,
	Dispatch,
	SetStateAction,
} from 'react';
import {
	ModalBody,
	ModalContent,
	ModalFooter,
} from '@/components/ui/animated-modal';
import {
	previewObject,
	walletPreview,
	walletPreviewReturn,
} from '@/utils/util';
import { AnimatePresence, motion } from 'framer-motion';
import CoinSelectionDropDown from './CoinSelectionDropDown';
import ChainSelectionDropDown from '@/components/walletdetail/ChainSelectionDropDown';
import { basePaths, coinUnit } from '@/lib/constants';
import { DerivationPathInput } from './DerivationPathsInput';
import TooltipComponent from '@/components/TooltipComponent';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { digitConverter } from '@/utils/digitConverter';

interface ImportWalletModalProps {
	modalId: string;
	closeModal: () => void;
	nextStep: (walletsToImport: previewObject[]) => void;
	currentKeyPhrase: string;
	changeStatus: (message: string, variant?: variantTypes) => void;
	walletsToImport: previewObject[];
	setWalletsToImport: Dispatch<SetStateAction<previewObject[]>>;
}

const ImportWalletModal: FC<ImportWalletModalProps> = ({
	modalId,
	closeModal,
	nextStep,
	currentKeyPhrase,
	changeStatus,
	setWalletsToImport,
	walletsToImport,
}) => {
	const [walletForPreview, setWalletForPreview] =
		useState<walletPreviewReturn | null>(null);
	const [coin, setCoin] = useState<coinTypes>('solana');
	const [chain, setChain] = useState<SolanaChain | EthereumChain | null>(null);

	const fetchWalletsToImport = async (index?: number) => {
		if (index) {
			setWalletForPreview(await walletPreview(currentKeyPhrase, index));
		} else {
			setWalletForPreview(await walletPreview(currentKeyPhrase));
		}
	};
	const handleImport = (wallet: previewObject, checked: CheckedState) => {
		if (checked === true) {
			setWalletsToImport((wallets) => {
				const walletExists = wallets.find((w) => w.pubkey === wallet.pubkey);
				if (!walletExists) {
					return [...wallets, wallet];
				}
				return wallets;
			});
		} else if (checked === false) {
			setWalletsToImport((wallets) =>
				wallets.filter((w) => w.pubkey !== wallet.pubkey)
			);
		}
	};
	const handleSpecialPath = (updatedPath: string) => {
		if (Number.isNaN(parseInt(updatedPath))) {
			if (updatedPath === '') return fetchWalletsToImport();
			return changeStatus('Enter valid number', 'warning');
		}
		fetchWalletsToImport(parseInt(updatedPath));
	};
	const handleNext = () => {
		nextStep(walletsToImport);
	};

	useEffect(() => {
		if (currentKeyPhrase) fetchWalletsToImport();
	}, [currentKeyPhrase]);
	return (
		<ModalBody modalId={modalId}>
			<ModalContent className='gap-5 bg-slate-800'>
				<div className='flex flex-col justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold'>
						Select Wallets to Import
					</h1>
					<div className='flex flex-col space-y-2 my-2'>
						<CoinSelectionDropDown
							setValue={setCoin}
							value={coin}
						/>
						<ChainSelectionDropDown
							coinType={coin!}
							setValue={setChain}
							value={chain}
						/>

						<DerivationPathInput
							basePath={basePaths[coin]}
							onPathChange={(updatedPath) => handleSpecialPath(updatedPath)}
						/>
					</div>
					<div className='p-2 flex flex-col space-y-2'>
						<div className='grid grid-cols-7 my-3'>
							<p className='col-span-4 '>Address</p>
							<p className='col-span-2 '>Balance</p>
							<p className='col-span-1 m-auto'>Import</p>
						</div>

						{walletForPreview === null && (
							<p className='text-center my-10 p-5'>Loading...</p>
						)}

						{walletForPreview !== null &&
							walletForPreview[
								coin === 'solana' ? 'solWalletPreview' : 'ethWalletPreview'
							].map((wallet, idx) => (
								<motion.div
									initial={{
										opacity: 0,
										y: 30,
									}}
									animate={{
										opacity: 1,
										y: [20, -5, 0],
									}}
									exit={{
										opacity: 0,
										y: -30,
									}}
									transition={{
										duration: 0.5,
										ease: [0.4, 0.0, 0.2, 1],
									}}
									key={wallet.pubkey + idx}
									className='grid grid-cols-7'>
									<p className='col-span-4'>
										<TooltipComponent
											triggerClassname='truncate max-w-[25ch]'
											fullValue={wallet.pubkey}
											triggerValue={wallet.pubkey}
										/>
									</p>
									<p className='col-span-2'>
										<TooltipComponent
											fullValue={wallet.balance}
											triggerValue={`${digitConverter(wallet.balance, true)} ${
												coinUnit[wallet.coin]
											}`}
										/>
									</p>
									<Checkbox
										checked={walletsToImport.some(
											(w) => w.pubkey === wallet.pubkey
										)}
										onCheckedChange={(checked) => handleImport(wallet, checked)}
										className='col-span-1 m-auto rounded-full'
									/>
								</motion.div>
							))}
					</div>
				</div>
			</ModalContent>

			<ModalFooter className='gap-4 '>
				<button
					onClick={() => {
						closeModal();
					}}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					back
				</button>
				<button
					onClick={handleNext}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					Next
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default ImportWalletModal;
