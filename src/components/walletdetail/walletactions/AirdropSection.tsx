import { coinUnit } from '@/constants/coinUnit';
import { solDrop } from '@/utils/solanaValidation';
import { FC, useState } from 'react';

interface AirdropSectionProps {
	wallet: Wallet;
	changeStatus: (message: string, variant?: variantTypes) => void;
	chainValue: SolanaChain | EthereumChain | null;
	fetchBalance: () => void;
}

const AirdropSection: FC<AirdropSectionProps> = ({
	changeStatus,
	wallet,
	chainValue,
	fetchBalance,
}) => {
	const [loading, setLoading] = useState(false);
	const handleSolDrop = async () => {
		setLoading(true);
		try {
			if (chainValue === 'mainnet') {
				throw new Error('Cannot perform airdrop on mainnet');
			}
			const msg = await solDrop(wallet.publicKey, chainValue as SolanaChain);
			fetchBalance();
			changeStatus(msg as string, 'success');
		} catch (error) {
			if (error instanceof Error) {
				changeStatus(
					error.message === 'Cannot perform airdrop on mainnet'
						? error.message
						: 'An error occurred while airdropping; you might be rate limited',
					error.message ? 'warning' : 'error'
				);
			} else {
				changeStatus('An unknown error occurred', 'error');
			}
		} finally {
			setLoading(false);
		}
	};
	const handleEthDrop = () => {
		setLoading(true);
		try {
			if (chainValue === 'mainnet') {
				throw new Error('Cannot perform airdrop on mainnet');
			} else if (chainValue === 'holesky') {
				window.open(
					'https://cloud.google.com/application/web3/faucet/ethereum/holesky',
					'_ blank'
				);
			} else if (chainValue === 'sepolia') {
				window.open(
					'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
					'_ blank'
				);
			}
		} catch (error) {
			if (error instanceof Error) {
				changeStatus(
					error.message === 'Cannot perform airdrop on mainnet'
						? error.message
						: 'An error occurred while airdropping; you might be rate limited',
					error.message ? 'warning' : 'error'
				);
			} else {
				changeStatus('An unknown error occurred', 'error');
			}
		} finally {
			setLoading(false);
		}
	};
	const handleDrop = () => {
		if (wallet.coinType === 'solana') {
			handleSolDrop();
		} else if (wallet.coinType === 'ethereum') {
			handleEthDrop();
		}
	};
	return (
		<button
			onClick={handleDrop}
			disabled={loading}
			className=' col-span-2 col-start-4 relative inline-flex overflow-hidden rounded-[6px] p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
			<span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FFFF_0%,#A855F7_50%,#00FFFF_100%)]' />
			<span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[6px]  bg-mybackground-dark px-3 py-3  text-lg font-medium text-white backdrop-blur-3xl'>
				{!loading && `Airdrop  ${coinUnit[wallet.coinType]}`}
				{loading && 'Requesting Airdrop'}
			</span>
		</button>
	);
};

export default AirdropSection;
