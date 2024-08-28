'use client';
import solIcon from '@/assets/images/solana-sol-logo.png';
import ethIcon from '@/assets/images/Ethereum-logo.png';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import ChainSelectionDropDown from '@/components/walletdetail/ChainSelectionDropDown';
import WalletDetailContainer from '@/components/walletdetail/WalletDetailContainer';
import WalletTabs from '@/components/walletdetail/wallettabs/WalletTabs';

interface pageProps {}

const WalletDetailsPage: FC<pageProps> = ({}) => {
	const params = useSearchParams();
	const [wallet, setWallet] = useState<Wallet | null>(null);
	const [tokenBalance, setTokenBalance] = useState<number>(0);
	const [amountToSend, setAmountToSend] = useState<number>(0);
	const [mounted, setMounted] = useState(false);
	const [chainValue, setChainValue] = useState<
		SolanaChain | EthereumChain | null
	>(null);
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
			<div className='flex items-center justify-between '>
				<div className='flex space-x-5'>
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

				<ChainSelectionDropDown
					coinType={wallet?.coinType!}
					value={chainValue}
					setValue={setChainValue}
				/>
			</div>
			<WalletDetailContainer
				chainValue={chainValue}
				setAmountToSend={setAmountToSend}
				setTokenBalance={setTokenBalance}
				tokenBalance={tokenBalance}
				wallet={wallet!}
			/>
			<WalletTabs
				wallet={wallet!}
				chainValue={chainValue}
			/>
		</div>
	);
};

export default WalletDetailsPage;
