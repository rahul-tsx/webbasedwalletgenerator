import { FC, Dispatch, SetStateAction } from 'react';
import {
	ModalBody,
	ModalContent,
	ModalFooter,
} from '@/components/ui/animated-modal';
import { previewObject } from '@/utils/util';

import { coinUnit } from '@/lib/constants';
import TooltipComponent from '@/components/TooltipComponent';

import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { AnimatePresence, motion } from 'framer-motion';
import { digitConverter } from '@/utils/digitConverter';

interface DisplayImportedWalletModalProps {
	modalId: string;
	closeModal: () => void;
	nextStep: () => void;
	walletsToImport: previewObject[];
	setWalletsToImport: Dispatch<SetStateAction<previewObject[]>>;
	loading: boolean;
}

const DisplayImportedWalletModal: FC<DisplayImportedWalletModalProps> = ({
	modalId,
	closeModal,
	nextStep,
	setWalletsToImport,
	walletsToImport,
	loading,
}) => {
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

	return (
		<ModalBody modalId={modalId}>
			<ModalContent className='gap-5 bg-slate-800'>
				<div className='flex flex-col justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold'>
						Do you want to import the following wallets?
					</h1>
					<div className='p-2 my-5 flex flex-col space-y-2'>
						<div className='grid grid-cols-7 my-3'>
							<p className='col-span-4'>Address</p>
							<p className='col-span-2'>Balance</p>
							<p className='col-span-1 m-auto'>Import</p>
						</div>

						{walletsToImport === null && (
							<p className='text-center my-10 p-5'>Loading...</p>
						)}

						<div className='max-h-[250px] overflow-y-auto  flex flex-col space-y-2 scrollbar-dark'>
							<AnimatePresence>
								{walletsToImport !== null &&
									walletsToImport.map((wallet, idx) => (
										<motion.div
											initial={{
												opacity: 0,
												x: -200, 
											}}
											animate={{
												opacity: 1,
												x: 0, 
											}}
											exit={{
												opacity: 0,
												x: -200, 
											}}
											transition={{
												delay: 0.5,
												duration: 0.75,
												ease: [0.4, 0.0, 0.2, 1],
											}}
											key={wallet.pubkey}
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
													triggerValue={`${digitConverter(
														wallet.balance,
														true
													)} ${coinUnit[wallet.coin]}`}
												/>
											</p>
											<Checkbox
												checked={walletsToImport.some(
													(w) => w.pubkey === wallet.pubkey
												)}
												onCheckedChange={(checked) =>
													handleImport(wallet, checked)
												}
												className='col-span-1 m-auto rounded-full'
											/>
										</motion.div>
									))}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</ModalContent>

			<ModalFooter className='gap-4 '>
				<button
					onClick={() => {
						closeModal();
					}}
					disabled={loading}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					back
				</button>
				<button
					onClick={nextStep}
					disabled={loading}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					{!loading && 'Import'}
					{loading && 'Importing wallets...'}
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default DisplayImportedWalletModal;
