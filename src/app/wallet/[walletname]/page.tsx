'use client';
import WalletInfo from '@/components/walletdetail/WalletInfo';
import solIcon from '@/assets/images/solana-sol-logo.png';
import ethIcon from '@/assets/images/Ethereum-logo.png';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import WalletTransaction from '@/components/walletdetail/WalletTransaction';
import WalletAction from '@/components/walletdetail/WalletAction';

interface pageProps {}

const WalletDetailsPage: FC<pageProps> = ({}) => {
	const params = useSearchParams();
	const [wallet, setWallet] = useState<Wallet | null>(null);
	const [mounted, setMounted] = useState(false);
	const retrieveWalletById = (id: string) => {
		const wallets: Wallet[] = JSON.parse(
			localStorage.getItem('wallets') || '[]'
		);
		return wallets.filter((wallet) => wallet.id === id)[0];
	};
	useEffect(() => {
		const id = params.get('id');
		if (id) {
			setWallet(retrieveWalletById(id));
		}
	}, [params]);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className='myContainer flex flex-col gap-10'>
			<div className='flex items-center space-x-5'>
				<div className='flex bg-white p-3 rounded-full'>
					<Image
						alt='coin logo'
						src={
							wallet?.coinType === 'solana'
								? solIcon
								: wallet?.coinType === 'ethereum'
								? ethIcon
								: ''
						}
						className='size-10'
					/>
				</div>

				<div className='text-[40px]'>{wallet?.name}</div>
			</div>

			<WalletInfo wallet={wallet!} />
			<WalletAction />
			<WalletTransaction />
		</div>
	);
};

export default WalletDetailsPage;
