'use client';
import { motion } from 'framer-motion';
import { FC, useContext, useRef, useState } from 'react';
import StatusContext from '@/context/statusContext';
import { useModal } from '../ui/animated-modal';
import SetPasswordModal from './SetPasswordModal';
import bcrypt from 'bcryptjs';
import LoginModal from './LoginModal';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

interface CtaProps {}

const Cta: FC<CtaProps> = ({}) => {
	const context = useContext(StatusContext);
	const { closeModal: closeModal1, openModal: openModal1 } =
		useModal('setPasswordModal1');
	const { closeModal: closeModal2, openModal: openModal2 } =
		useModal('loginWalletModal2');
	const [localPassword, setLocalPassword] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;
	const modal1Ref = useRef<HTMLButtonElement>(null);
	const modal2Ref = useRef<HTMLButtonElement>(null);
	const { setAuthStatus } = useAuthStore();
	const router = useRouter();

	const handleOnboarding = () => {
		if (!sessionStorage.getItem('isAuth')) {
			if (localStorage.getItem('localPassword')) {
				openModal2();
			} else {
				openModal1();
			}
		} else {
			router.push('/wallet');
		}
	};
	const handlePasswordCheck = async (password: string) => {
		const hash = localStorage.getItem('localPassword');

		if (hash) {
			bcrypt.compare(password, hash, function (err, res) {
				if (res) {
					closeModal2();
					setErrorMessage(null);

					setAuthStatus(true);
					sessionStorage.setItem('isAuth', 'true');
					router.push('/wallet');
				} else {
					setErrorMessage('Wrong password. Try Again !!!');
				}
			});
		} else {
			setErrorMessage('No password found');
			closeModal2();
		}
	};

	const handlePassword = async (password: string) => {
		console.log(password);
		bcrypt.genSalt(10, function (err, salt) {
			bcrypt.hash(password, salt, function (err, hash) {
				localStorage.setItem('localPassword', hash);
			});
		});
	};

	const handleModal1Click = () => {
		if (modal1Ref.current) {
			modal1Ref.current.click();
		}
	};
	const handleModal2Click = () => {
		if (modal2Ref.current) {
			modal2Ref.current.click();
		}
	};
	return (
		<>
			<div className='flex items-center'>
				<motion.button
					initial={{
						opacity: 0,
						y: 20,
					}}
					animate={{
						opacity: 1,
						y: [20, -5, 0],
					}}
					transition={{
						delay: 2.5,
						duration: 0.5,
						ease: [0.4, 0.0, 0.2, 1],
					}}
					onClick={handleOnboarding}
					className='relative mx-auto inline-flex overflow-hidden rounded-[6px] p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 md:min-w-[250px]'>
					<span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FFFF_0%,#A855F7_50%,#00FFFF_100%)]' />
					<span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[6px]  bg-mybackground-dark px-3 py-3  text-lg font-medium text-white backdrop-blur-3xl'>
						Get Started
					</span>
				</motion.button>
			</div>
			<SetPasswordModal
				modalId={'setPasswordModal1'}
				handleNextClick={handleModal1Click}
				modal1Ref={modal1Ref}
				onCancel={closeModal1}
				nextStep={handlePassword}
			/>
			<LoginModal
				modalId={'loginWalletModal2'}
				handleNextClick={handleModal2Click}
				modal2Ref={modal2Ref}
				onCancel={closeModal2}
				nextStep={handlePasswordCheck}
				errorMessage={errorMessage}
			/>
		</>
	);
};

export default Cta;
