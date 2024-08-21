import { solDrop } from '@/utils/solanaValidation';
import { FC, useState } from 'react';

interface AirdropSectionProps {
	wallet: Wallet;
	changeStatus: (message: string, variant?: variantTypes) => void;
}

const AirdropSection: FC<AirdropSectionProps> = ({ changeStatus, wallet }) => {
	const [loading, setLoading] = useState(false);
	const handleSolDrop = async () => {
		setLoading(true);
		try {
			const msg = await solDrop(wallet.publicKey);
			changeStatus(msg as string, 'success');
		} catch (error) {
			changeStatus(
				'An Error Occured while air dropping you might be rate limited',
				'error'
			);
		} finally {
			setLoading(false);
		}
	};
	const handleDrop = () => {
		if (wallet.coinType === 'solana') {
			handleSolDrop();
		} else if (wallet.coinType === 'ethereum') {
			window.open(
				'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
				'_ blank'
			);
		}
	};
	return (
		<button
			onClick={handleDrop}
			disabled={loading}
			className=' col-span-2 col-start-2 relative inline-flex overflow-hidden rounded-[6px] p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
			<span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FFFF_0%,#A855F7_50%,#00FFFF_100%)]' />
			<span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[6px]  bg-mybackground-dark px-3 py-3  text-lg font-medium text-white backdrop-blur-3xl'>
				{!loading &&
					`Airdrop 1 ${
						wallet.coinType === 'solana'
							? 'Sol'
							: wallet.coinType === 'ethereum'
							? 'Ether'
							: ''
					}`}
				{loading && 'Requesting Airdrop'}
			</span>
		</button>
	);
};

export default AirdropSection;
