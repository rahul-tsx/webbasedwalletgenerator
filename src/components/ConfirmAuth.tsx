import { FC, useEffect, useRef, useState } from 'react';
import LoginModal from './home/onboarding/LoginModal';
import { useAuthStore } from '@/store/auth';
import { validatePassword } from '@/utils/handleSecretKey';
import { useModal } from './ui/animated-modal';

interface ConfirmAuthProps {
	onSuccess: () => void;
	onExit: () => void;
	open: boolean;
}

const ConfirmAuth: FC<ConfirmAuthProps> = ({ onSuccess, open, onExit }) => {
	const { closeModal: closeModal1, openModal: openModal1 } =
		useModal('passwordCheckModal');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { setLocalPassword } = useAuthStore();
	const modal2Ref = useRef<HTMLButtonElement>(null);
	const handleModal2Click = () => {
		if (modal2Ref.current) {
			modal2Ref.current.click();
		}
	};
	useEffect(() => {
		if (open) openModal1();
	}, []);

	const handlePasswordCheck = async (password: string) => {
		const hash = localStorage.getItem('localPassword');

		if (hash) {
			const isPasswordValid = await validatePassword(password, hash);
			if (isPasswordValid) {
				closeModal1();
				setErrorMessage(null);
				setLocalPassword(password);
				onSuccess();
			} else {
				setErrorMessage('Wrong password. Try Again !!!');
			}
		} else {
			setErrorMessage('No password found');
			closeModal1();
		}
	};

	return (
		<LoginModal
			modalId='passwordCheckModal'
			errorMessage={errorMessage}
			handleNextClick={handleModal2Click}
			nextStep={handlePasswordCheck}
			onCancel={() => {
				closeModal1();
				onExit();
			}}
			type='check'
			modal2Ref={modal2Ref}
		/>
	);
};

export default ConfirmAuth;
