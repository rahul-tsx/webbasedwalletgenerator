import StatusContext from '@/context/statusContext';
import { getEthBalance } from '@/utils/ethereumValidation';
import { getSolBalance } from '@/utils/solanaValidation';
import {
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { BiRefresh } from 'react-icons/bi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import RefreshButton from '../ui/refresh-button';

interface WalletInfoProps {
	wallet: Wallet;
	tokenBalance: number;
	setTokenBalance: Dispatch<SetStateAction<number>>;
}

const WalletInfo: FC<WalletInfoProps> = ({
	wallet,
	setTokenBalance,
	tokenBalance,
}) => {
	const [visibleBalance, setVisibleBalance] = useState(false);
	const [visiblePkey, setVisiblePkey] = useState(false);
	const [visibleTokenBalance, setVisibleTokenBalance] = useState(false);

	const fetchBalance = async () => {
		console.log('fetched');
		let balance;
		if (wallet.coinType === 'solana') {
			balance = await getSolBalance(wallet.publicKey);
		}
		if (wallet.coinType === 'ethereum') {
			balance = await getEthBalance(wallet.publicKey);
		}
		setTokenBalance(balance || 0);
	};

	useEffect(() => {
		fetchBalance();
	}, [wallet]);

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
					<div className='flex justify-between'>
						<h2 className='text-white text-5xl font-bold'>
							$ {visibleBalance ? '393.32' : '***'}
						</h2>
						<button
							onClick={toggleVisibleBalance}
							className='focus:outline-none p-2 z-10'>
							{visibleBalance ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
						</button>
					</div>

					<p className='text-gray-400'>Your balance</p>
				</div>
			</div>
			<div className='col-span-4 max-w-[400px] md:m-0 m-auto w-full h-48 bg-slate-800 rounded-lg relative overflow-hidden p-4'>
				<div className='absolute top-20 left-48 w-64 h-64 bg-gray-950 opacity-30 rounded-full'></div>

				<div className='absolute -top-16 -right-16 w-48 h-48 bg-gray-700 opacity-40 rounded-full'></div>

				<div className='flex flex-col gap-2'>
					<div className='flex justify-between'>
						<h2 className='text-white text-5xl font-bold'>
							{visibleTokenBalance ? tokenBalance : '***'}{' '}
							<span className='text-lg'>
								{wallet?.coinType === 'solana'
									? 'Sol'
									: wallet?.coinType === 'ethereum'
									? 'ether'
									: ''}
							</span>
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
			<div className='col-span-2 -col-start-3 my-5'>
				<RefreshButton
					onClick={fetchBalance}
					text='Refresh Balance'
					duration={5000}
				/>
			</div>

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

				{wallet && (
					<div className='col-span-4 flex items-center'>
						<CopyToClipboard
							text={wallet.publicKey}
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
				)}
			</div>
			<div className='grid grid-cols-6 col-span-8  w-full space-x-5 items-center'>
				<label className='text-xl font-bold text-white col-span-1'>
					Derivation Path
				</label>

				{wallet && (
					<div className='col-span-4 flex items-center'>
						<CopyToClipboard
							text={wallet.publicKey}
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
		</div>
	);
};

export default WalletInfo;
