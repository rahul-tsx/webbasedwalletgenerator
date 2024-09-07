import { FC, RefObject } from 'react';
import { ModalBody, ModalContent, ModalFooter } from '../../ui/animated-modal';
import SetPasswordForm from './SetPasswordForm';

interface SetPasswordModalProps {
	modalId: string;
	handleNextClick: () => void;
	modal1Ref: RefObject<HTMLButtonElement>;
	onCancel: () => void;
	nextStep: (password: string) => void;
}

const SetPasswordModal: FC<SetPasswordModalProps> = ({
	handleNextClick,
	modal1Ref,
	modalId,
	onCancel,
	nextStep,
}) => {
	return (
		<ModalBody modalId={modalId}>
			<ModalContent className='gap-5 bg-slate-800'>
				<div className='flex justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold capitalize'>
						Set your local password
					</h1>
				</div>
				<SetPasswordForm
					closeModal={onCancel}
					nextStep={nextStep}
					ref={modal1Ref}
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

export default SetPasswordModal;
