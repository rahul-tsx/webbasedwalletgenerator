import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Modal } from '../ui/animated-modal';
import WalletAction from './WalletAction';
import WalletInfo from './WalletInfo';
import { getSolBalance, getSoltoUsd } from '@/utils/solanaValidation';
import { getEthBalance, getEthtoUsd } from '@/utils/ethereumValidation';

interface WalletDetailContainerProps {
	wallet: Wallet;
	setTokenBalance: Dispatch<SetStateAction<number>>;
	tokenBalance: number;
	chainValue: SolanaChain | EthereumChain | null;
	setAmountToSend: Dispatch<SetStateAction<number>>;
}

const WalletDetailContainer: FC<WalletDetailContainerProps> = ({
	chainValue,
	setAmountToSend,
	setTokenBalance,
	tokenBalance,
	wallet,
}) => {
	const [valueBalance, setvalueBalance] = useState<dollarChart>({
		currentPrice: null,
		percentageChange: null,
		priceDifference: null,
		totalValue: null,
	});
	const fetchBalance = async () => {
		let balance;
		let dollar;
		if (wallet.coinType === 'solana') {
			if (chainValue) {
				balance = await getSolBalance(
					wallet.publicKey,
					chainValue as SolanaChain
				);
			} else {
				balance = await getSolBalance(wallet.publicKey);
			}

			dollar = await getSoltoUsd(
				balance || 0,
				valueBalance?.currentPrice || null
			);

			if (dollar) {
				setvalueBalance({
					totalValue: dollar.totalValue,
					percentageChange: dollar.percentageChange,
					priceDifference: dollar.priceDifference,
					currentPrice: dollar.currentPrice,
				});
			}
		}
		if (wallet.coinType === 'ethereum') {
			if (chainValue) {
				balance = await getEthBalance(
					wallet.publicKey,
					chainValue as EthereumChain
				);
			} else {
				balance = await getEthBalance(wallet.publicKey);
			}
			dollar = await getEthtoUsd(
				balance || 0,
				valueBalance?.currentPrice || null
			);

			if (dollar) {
				setvalueBalance({
					totalValue: dollar.totalValue,
					percentageChange: dollar.percentageChange,
					priceDifference: dollar.priceDifference,
					currentPrice: dollar.currentPrice,
				});
			}
		}
		setTokenBalance(balance || 0);
	};

	useEffect(() => {
		fetchBalance();
	}, [chainValue]);

	return (
		<div className='w-full flex flex-col gap-10'>
			<WalletInfo
				wallet={wallet!}
				tokenBalance={tokenBalance}
				valueBalance={valueBalance}
				fetchBalance={fetchBalance}
			/>
			<Modal>
				<WalletAction
					wallet={wallet!}
					tokenBalance={tokenBalance}
					chainValue={chainValue}
					setAmountToSend={setAmountToSend}
					fetchBalance={fetchBalance}
				/>
			</Modal>
		</div>
	);
};

export default WalletDetailContainer;
