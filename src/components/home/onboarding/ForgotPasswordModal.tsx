import { FC } from 'react';
import {
	ModalBody,
	ModalContent,
	ModalFooter,
} from '@/components/ui/animated-modal';

interface ForgotPasswordModalProps {
	modalId: string;
	setStatus: (message: string, variant?: variantTypes) => void;
	closeModal: () => void;
	nextStep: () => void;
}

const ForgotPasswordModal: FC<ForgotPasswordModalProps> = ({
	setStatus,
	modalId,
	closeModal,
	nextStep,
}) => {
	const handleNext = () => {
		nextStep();
	};

	return (
		<ModalBody modalId={modalId}>
			<ModalContent className='gap-5 bg-slate-800'>
				<div className='flex justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold'>Wallet Recovery</h1>
				</div>
				<p className='text-center text-3xl font-bold text-red-600'>Warning!</p>
				<ul className='text-lg text-red-500 mt-4 lg:w-3/4 mx-auto flex flex-col space-y-5 list-disc'>
					<li className=''>
						{' '}
						{`At the moment, if you forget your password, there is no way to
						recover your wallet. However, you can delete your wallet and
						manually recover it using your secret recovery phrase.`}
					</li>
					<li className=''>
						{`Please make sure you have securely stored your secret recovery
						phrase before proceeding. Deleting your wallet will permanently
						remove all data stored in this app, and you'll need to re-import it
						with your recovery phrase.`}
					</li>
				</ul>
			</ModalContent>

			<ModalFooter className='gap-4'>
				<button
					onClick={closeModal}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					Back
				</button>
				<button
					onClick={handleNext}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-red-900 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					Delete
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default ForgotPasswordModal;
