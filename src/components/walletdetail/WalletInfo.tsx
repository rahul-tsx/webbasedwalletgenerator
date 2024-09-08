import StatusContext from '@/context/statusContext';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import RefreshButton from '../ui/refresh-button';
import TooltipComponent from '../TooltipComponent';
import { digitConverter } from '@/utils/digitConverter';
import { coinUnit } from '@/lib/constants';
import { Button } from '../ui/button';
import { useModal } from '../ui/animated-modal';
import LoginModal from '../home/onboarding/LoginModal';
import { decryptData, validatePassword } from '@/utils/handleSecretKey';
import ShowPrivKeyModal from './ShowPrivKeyModal';

interface WalletInfoProps {
	wallet: Wallet;
	tokenBalance: number;
	valueBalance: dollarChart;
	fetchBalance: () => {};
}

const WalletInfo: FC<WalletInfoProps> = ({
	wallet,
	tokenBalance,
	valueBalance,
}) => {
	const [visibleBalance, setVisibleBalance] = useState(false);
	const [visiblePkey, setVisiblePkey] = useState(false);
	const [visibleTokenBalance, setVisibleTokenBalance] = useState(false);
	const [decryptedPrivateKey, setDecryptedPrivateKey] = useState<string | null>(
		null
	);
	const { closeModal: closeModal1, openModal: openModal1 } = useModal(
		'showPrivateKeyModal1'
	);
	const { closeModal: closeModal2, openModal: openModal2 } = useModal(
		'showPrivateKeyModal2'
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const modal1Ref = useRef<HTMLButtonElement>(null);
	const handleModal1Click = () => {
		if (modal1Ref.current) {
			modal1Ref.current.click();
		}
	};

	const toggleVisibleBalance = () => {
		setVisibleBalance((prev) => !prev);
	};
	const derivePath = (coinType: string, index: number) => {
		let path = '';
		switch (coinType) {
			case 'solana':
				path = `m/44'/501'/${index}'/0'`;
				break;
			case 'ethereum':
				path = `m/44'/60'/0'/0/${index}`;
				break;
			default:
				break;
		}
		return path;
	};
	const handlePasswordCheck = async (password: string) => {
		const hash = localStorage.getItem('localPassword');

		if (hash) {
			const isPasswordValid = await validatePassword(password, hash);
			if (isPasswordValid) {
				const decryptedPrivKey = decryptData(wallet.privateKey, password);
				setDecryptedPrivateKey(decryptedPrivKey);
				closeModal1();
				setErrorMessage(null);
			} else {
				setErrorMessage('Wrong password. Try Again !!!');
			}
		} else {
			setErrorMessage('No password found');
			closeModal1();
		}
	};
	useEffect(() => {
		if (decryptedPrivateKey) openModal2();
	}, [decryptedPrivateKey]);

	const context = useContext(StatusContext);

	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;
	return (
		<div className='grid md:grid-cols-8 grid-cols-4 gap-5 '>
			<div className='col-span-4 max-w-[400px] md:m-0 m-auto w-full h-48 bg-slate-800 rounded-lg relative overflow-hidden p-4'>
				<div className='absolute top-20 left-48 w-64 h-64 bg-gray-950 opacity-30 rounded-full'></div>

				<div className='absolute -top-16 -right-16 w-48 h-48 bg-gray-700 opacity-40 rounded-full'></div>

				<div className='flex flex-col gap-2'>
					<div className='flex justify-between z-10'>
						<h2 className='text-white text-5xl font-bold'>
							${' '}
							{visibleBalance ? (
								<TooltipComponent
									triggerValue={digitConverter(
										valueBalance.totalValue || 0,
										false
									)}
									fullValue={valueBalance.totalValue?.toFixed(4) || 0}
									unit={'USD'}
								/>
							) : (
								'***'
							)}
						</h2>
						<button
							onClick={toggleVisibleBalance}
							className='focus:outline-none p-2 z-10'>
							{visibleBalance ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
						</button>
					</div>
					<div className='flex justify-between'>
						<p className='text-gray-400'>Your balance</p>
						<div className='font-bold z-10 flex space-x-5'>
							{valueBalance.percentageChange && tokenBalance !== 0 && (
								<span
									className={`${
										valueBalance.percentageChange &&
										parseFloat(valueBalance.percentageChange) >= 0
											? 'text-green-600'
											: 'text-red-600'
									}`}>
									{valueBalance.percentageChange} %
								</span>
							)}

							{valueBalance.priceDifference && tokenBalance !== 0 && (
								<span
									className={`${
										valueBalance.priceDifference &&
										parseFloat(valueBalance.priceDifference) >= 0
											? 'text-green-600'
											: 'text-red-600'
									}`}>
									{valueBalance.priceDifference} $
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className='col-span-4 max-w-[400px] md:m-0 m-auto w-full h-48 bg-slate-800 rounded-lg relative overflow-hidden p-4'>
				<div className='absolute top-20 left-48 w-64 h-64 bg-gray-950 opacity-30 rounded-full'></div>

				<div className='absolute -top-16 -right-16 w-48 h-48 bg-gray-700 opacity-40 rounded-full'></div>

				<div className='flex flex-col gap-2'>
					<div className='flex justify-between z-10'>
						<h2 className='text-white text-5xl font-bold'>
							{visibleTokenBalance ? (
								<TooltipComponent
									triggerValue={digitConverter(tokenBalance, true)}
									fullValue={tokenBalance}
									unit={coinUnit[wallet.coinType]}
								/>
							) : (
								'***'
							)}{' '}
							<span className='text-lg'>{coinUnit[wallet.coinType]}</span>
						</h2>
						<button
							onClick={() => setVisibleTokenBalance((prev) => !prev)}
							className='focus:outline-none p-2 z-10'>
							{visibleTokenBalance ? (
								<FaEye size={20} />
							) : (
								<FaEyeSlash size={20} />
							)}
						</button>
					</div>

					<p className='text-gray-400'>
						Your{' '}
						{wallet?.coinType === 'solana'
							? 'Sol'
							: wallet?.coinType === 'ethereum'
							? 'Ether'
							: ''}{' '}
						balance
					</p>
				</div>
			</div>
			{/* <div className='col-span-2 -col-start-3 my-5'>
				<RefreshButton
					onClick={fetchBalance}
					text='Refresh Balance'
					duration={5000}
				/>
			</div> */}

			<div className='grid grid-cols-6 col-span-8  w-full space-x-5 items-center'>
				<label className='text-xl font-bold text-white col-span-1'>
					Public Key
				</label>

				{wallet && (
					<div className='col-span-4'>
						<CopyToClipboard
							text={wallet.publicKey}
							onCopy={() =>
								changeStatus('Public Key Copied to Clipboard!', 'success')
							}>
							<span className='key-wrap hover:underline tracking-wide cursor-pointer'>
								{wallet.publicKey}
							</span>
						</CopyToClipboard>
					</div>
				)}
			</div>

			<div className='grid grid-cols-6 col-span-8  w-full space-x-5 items-center'>
				<label className='text-xl font-bold text-white col-span-1'>
					Private Key
				</label>

				{/* {wallet && (
					<div className='col-span-4 flex items-center'>
						<CopyToClipboard
							text={wallet.privateKey}
							onCopy={() =>
								changeStatus('Private Key Copied to Clipboard!', 'success')
							}>
							<p className='key-wrap hover:underline tracking-wide cursor-pointer'>
								{visiblePkey ? wallet.privateKey : '*'.repeat(50)}
							</p>
						</CopyToClipboard>
						<button
							onClick={() => setVisiblePkey((prev) => !prev)}
							className='focus:outline-none p-2'>
							{visiblePkey ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
						</button>
					</div>
				)} */}
				<Button onClick={openModal1}>Show Private Key</Button>
			</div>
			<div className='grid grid-cols-6 col-span-8  w-full space-x-5 items-center'>
				<label className='text-xl font-bold text-white col-span-1'>
					Derivation Path
				</label>

				{wallet && (
					<div className='col-span-4 flex items-center'>
						<CopyToClipboard
							text={derivePath(wallet.coinType, wallet.pathIndex)}
							onCopy={() =>
								changeStatus('Derivation Path Copied to Clipboard!', 'success')
							}>
							<p className='key-wrap hover:underline tracking-wide cursor-pointer'>
								{derivePath(wallet.coinType, wallet.pathIndex)}
							</p>
						</CopyToClipboard>
					</div>
				)}
			</div>
			<LoginModal
				modalId={'showPrivateKeyModal1'}
				handleNextClick={handleModal1Click}
				modal2Ref={modal1Ref}
				onCancel={closeModal1}
				nextStep={handlePasswordCheck}
				errorMessage={errorMessage}
				type='check'
			/>
			<ShowPrivKeyModal
				modalId={'showPrivateKeyModal2'}
				privKey={decryptedPrivateKey!}
				setStatus={changeStatus}
				closeModal={() => {
					closeModal2();
					setDecryptedPrivateKey(null);
				}}
			/>
		</div>
	);
};

export default WalletInfo;
