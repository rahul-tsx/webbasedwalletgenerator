import { FC, RefObject } from 'react';
import {
	ModalBody,
	ModalContent,
	ModalFooter,
} from '@/components/ui/animated-modal';
import LoginForm from './LoginForm';

interface LoginModalProps {
	modalId: string;
	handleNextClick: () => void;
	modal2Ref: RefObject<HTMLButtonElement>;
	onCancel: () => void;
	nextStep: (password: string) => void;
	errorMessage: string | null;
	type?: 'default' | 'check';
	handleForgotPassword?: () => void;
}

const LoginModal: FC<LoginModalProps> = ({
	handleNextClick,
	modal2Ref,
	modalId,
	onCancel,
	nextStep,
	errorMessage,
	type = 'default',
	handleForgotPassword,
}) => {
	return (
		<ModalBody
			modalId={modalId}
			className='min-h-fit lg:max-w-[40%] 2xl:max-w-[35%]'>
			<ModalContent className='gap-5 bg-slate-800 '>
				<div className='flex justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold capitalize'>
						{type === 'default' ? 'Welcome Back' : ''}
					</h1>
				</div>
				<LoginForm
					closeModal={onCancel}
					nextStep={nextStep}
					ref={modal2Ref}
					errorMessage={errorMessage}
					handleForgotPassword={handleForgotPassword}
					type={type}
				/>
			</ModalContent>
			<ModalFooter className='gap-4 '>
				(
				<button
					onClick={onCancel}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					cancel
				</button>
				)
				<button
					onClick={handleNextClick}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					{type === 'default' ? 'Unlock' : 'Submit'}
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default LoginModal;
