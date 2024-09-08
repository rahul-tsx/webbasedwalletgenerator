'use client';
import { motion } from 'framer-motion';
import { FC, useContext, useRef, useState } from 'react';
import StatusContext from '@/context/statusContext';
import { useModal } from '../ui/animated-modal';
import SetPasswordModal from './onboarding/SetPasswordModal';
import bcrypt from 'bcryptjs';
import LoginModal from './onboarding/LoginModal';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

import SecretPharseModal from './onboarding/SecretPharseModal';
import { encryptData, validatePassword } from '@/utils/handleSecretKey';
import { deriveWallet, previewObject, walletPreview } from '@/utils/util';
import SelectActionModal from './onboarding/SelectActionModal';
import ImportWalletWithSecretPharseModal from './onboarding/ImportWalletWithSecretPharseModal';
import ImportWalletModal from './onboarding/ImportWalletModal';
import DisplayImportedWalletModal from './onboarding/DisplayImportedWalletModal';
import ForgotPasswordModal from './onboarding/ForgotPasswordModal';

interface CtaProps {}

const Cta: FC<CtaProps> = ({}) => {
	const context = useContext(StatusContext);
	const { closeModal: closeModal1, openModal: openModal1 } =
		useModal('setPasswordModal1');
	const { closeModal: closeModal2, openModal: openModal2 } =
		useModal('loginWalletModal2');
	const { closeModal: closeModal3, openModal: openModal3 } =
		useModal('onBoarding1');
	const { closeModal: closeModal4, openModal: openModal4 } =
		useModal('onBoarding2');
	const { closeModal: closeModal5, openModal: openModal5 } =
		useModal('onBoarding3');
	const { closeModal: closeModal6, openModal: openModal6 } =
		useModal('onBoarding4');
	const { closeModal: closeModal7, openModal: openModal7 } =
		useModal('onBoarding5');
	const { closeModal: closeModal8, openModal: openModal8 } = useModal(
		'forgotPasswordModal3'
	);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [currentSecretPhrase, setCurrentSecretPhrase] = useState<string | null>(
		null
	);
	const [walletsToImport, setWalletsToImport] = useState<previewObject[]>([]);
	const [loading, setLoading] = useState(false);

	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;
	const modal1Ref = useRef<HTMLButtonElement>(null);
	const modal2Ref = useRef<HTMLButtonElement>(null);
	const modal5Ref = useRef<HTMLButtonElement>(null);

	const { setAuthStatus, setLocalPassword, localPassword } = useAuthStore();
	const router = useRouter();

	const handleLogin = () => {
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
			const isPasswordValid = await validatePassword(password, hash);
			if (isPasswordValid) {
				closeModal2();
				setErrorMessage(null);

				setAuthStatus(true);
				sessionStorage.setItem('isAuth', 'true');
				setLocalPassword(password);
				router.push('/wallet');
			} else {
				setErrorMessage('Wrong password. Try Again !!!');
			}
		} else {
			setErrorMessage('No password found');
			closeModal2();
		}
	};

	const handlePassword = async (password: string) => {
		bcrypt.genSalt(10, function (err, salt) {
			bcrypt.hash(password, salt, function (err, hash) {
				localStorage.setItem('localPassword', hash);
			});
		});
		setLocalPassword(password);
		openModal3();
	};
	const setPrimarySecretKey = (secret: string) => {
		if (localPassword) {
			const encryptedMnemonic = encryptData(secret, localPassword);
			localStorage.setItem('encryptedMnemonic', encryptedMnemonic);
			return true;
		}
		return false;
	};
	const handleOnboarding2 = (secret: string) => {
		try {
			if (setPrimarySecretKey(secret)) {
				deriveWallet(secret, localPassword!);
				setAuthStatus(true);
				sessionStorage.setItem('isAuth', 'true');
				closeModal4();
				router.push('/wallet');
			}
		} catch (error) {
			console.log(error);
		}
	};
	const handleImportedKeyPhrase = (mnemonic: string) => {
		closeModal3();
		setCurrentSecretPhrase(mnemonic);
		openModal6();
	};
	const handleWalletsToImport = (walletsToImport: previewObject[]) => {
		closeModal6();
		openModal7();
	};
	const importWallets = () => {
		setLoading(true);
		try {
			if (currentSecretPhrase) {
				if (setPrimarySecretKey(currentSecretPhrase)) {
					walletsToImport.map((wallet) =>
						deriveWallet(
							currentSecretPhrase,
							localPassword!,
							wallet.coin,
							wallet.index
						)
					);
					setAuthStatus(true);
					sessionStorage.setItem('isAuth', 'true');

					router.push('/wallet');
				}
			} else {
				localStorage.removeItem('localPassword');
				router.push('/');
				changeStatus('Secret Pharse not found', 'error');
			}
		} catch (error) {
			console.log(error);
			changeStatus('Some Unexpected Error Occured Try Again', 'error');
		} finally {
			setLoading(false);
			closeModal7();
		}
	};
	const handleForgotPassword = () => {
		setLocalPassword('');
		setAuthStatus(false);
		sessionStorage.clear();
		localStorage.clear();
		closeModal8();
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
	const handleModal5Click = () => {
		if (modal5Ref.current) {
			modal5Ref.current.click();
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
					onClick={handleLogin}
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
				handleForgotPassword={openModal8}
			/>
			<SelectActionModal
				modalId={'onBoarding1'}
				generateWallet={() => {
					openModal4();
					closeModal3();
				}}
				importWallet={() => {
					openModal5();
					closeModal3();
				}}
			/>
			<SecretPharseModal
				modalId='onBoarding2'
				setStatus={changeStatus}
				closeModal={() => {
					openModal3();
					closeModal4();
				}}
				nextStep={handleOnboarding2}
			/>
			<ImportWalletWithSecretPharseModal
				modalId='onBoarding3'
				closeModal={() => {
					openModal3();
					closeModal5();
				}}
				nextStep={handleImportedKeyPhrase}
				modalRef={modal5Ref}
				handleNextClick={handleModal5Click}
			/>
			<ImportWalletModal
				closeModal={() => {
					closeModal6();
					openModal5();
				}}
				currentKeyPhrase={currentSecretPhrase!}
				modalId='onBoarding4'
				nextStep={handleWalletsToImport}
				changeStatus={changeStatus}
				setWalletsToImport={setWalletsToImport}
				walletsToImport={walletsToImport}
			/>
			<DisplayImportedWalletModal
				closeModal={() => {
					closeModal7();
					openModal6();
				}}
				modalId='onBoarding5'
				nextStep={importWallets}
				setWalletsToImport={setWalletsToImport}
				walletsToImport={walletsToImport}
				loading={loading}
			/>
			<ForgotPasswordModal
				closeModal={() => {
					closeModal8();
					openModal2();
				}}
				modalId='forgotPasswordModal3'
				nextStep={handleForgotPassword}
				setStatus={changeStatus}
			/>
		</>
	);
};

export default Cta;
