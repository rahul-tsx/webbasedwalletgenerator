import { useState, useEffect, FC, RefObject } from 'react';
import {
	ModalBody,
	ModalContent,
	ModalFooter,
} from '@/components/ui/animated-modal';


import SecretPharseInputForm from './SecretPharseInputForm';

interface ImportWalletWithSecretPharseModalProps {
	modalId: string;
	closeModal: () => void;
	nextStep: (secret: string) => void;
	modalRef: RefObject<HTMLButtonElement>;
	handleNextClick: () => void;
}

const ImportWalletWithSecretPharseModal: FC<
	ImportWalletWithSecretPharseModalProps
> = ({ modalId, closeModal, nextStep, modalRef, handleNextClick }) => {
	return (
		<ModalBody modalId={modalId}>
			<ModalContent className='gap-5 bg-slate-800'>
				<div className='flex justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold'>
						Enter Your 12 words Secret Phrase
					</h1>
				</div>
				<SecretPharseInputForm
					closeModal={closeModal}
					nextStep={nextStep}
					ref={modalRef}
				/>
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
					onClick={handleNextClick}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					Next
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default ImportWalletWithSecretPharseModal;
