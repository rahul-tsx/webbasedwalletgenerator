import { Dispatch, FC, RefObject, SetStateAction } from 'react';
import { ModalBody, ModalContent, ModalFooter } from '../../ui/animated-modal';
import AddReceiverForm from './AddReceiverForm';
import { coinUnit } from '@/lib/constants';

interface AddReceiverModalProps {
	modalId: string;
	wallet: Wallet;
	setReceiverPubKey: Dispatch<SetStateAction<string | null>>;
	onCancel: () => void;
	nextStep: () => void;
	handleNextClick: () => void;
	modal1Ref: RefObject<HTMLButtonElement>;
}

const AddReceiverModal: FC<AddReceiverModalProps> = ({
	modalId,
	wallet,
	setReceiverPubKey,
	onCancel,
	nextStep,
	handleNextClick,
	modal1Ref,
}) => {
	return (
		<ModalBody modalId={modalId}>
			<ModalContent className='gap-5 bg-slate-800'>
				<div className='flex justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold capitalize'>
						Send {coinUnit[wallet.coinType]}
					</h1>
				</div>
				<AddReceiverForm
					coinType={wallet.coinType}
					setReceiverPubKey={setReceiverPubKey}
					closeModal={onCancel}
					nextStep={nextStep}
					ref={modal1Ref}
					senderPubKey={wallet.publicKey}
				/>
			</ModalContent>
			<ModalFooter className='gap-4 '>
				<button
					onClick={onCancel}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					cancel
				</button>
				<button
					onClick={handleNextClick}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					Next
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default AddReceiverModal;
