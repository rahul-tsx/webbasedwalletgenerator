import { Dispatch, FC, RefObject, SetStateAction } from 'react';
import { ModalBody, ModalContent, ModalFooter } from '../ui/animated-modal';
import CreateWalletForm from './CreateWalletForm';

interface AddNewWalletModalProps {
	formRef: RefObject<HTMLButtonElement>;
	id: string;
	index: number;
	mnemonic: string;
	deriveWallet: ({
		mnemonic,
		coinType,
		walletName,
	}: {
		mnemonic: string;
		coinType: string;
		walletName: string;
	}) => void;
	closeModal: () => void;
	handleSubmitClick: () => void;
}

const AddNewWalletModal: FC<AddNewWalletModalProps> = ({
	id,
	deriveWallet,
	formRef,
	handleSubmitClick,
	index,
	mnemonic,
	closeModal,
}) => {
	return (
		<ModalBody
			className=''
			modalId={id}>
			<ModalContent className='gap-5 bg-slate-800 '>
				<div className='flex flex-col justify-between '>
					<h1 className='text-lg lg:text-2xl font-bold '>
						Create a new Wallet
					</h1>

					<CreateWalletForm
						ref={formRef}
						defaultSecretPhrase={mnemonic}
						index={index + 1}
						createWallet={deriveWallet}
					/>
				</div>
			</ModalContent>
			<ModalFooter className='gap-4 grid grid-cols-4 '>
				<button
					onClick={() => closeModal()}
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
	);
};

export default AddNewWalletModal;
