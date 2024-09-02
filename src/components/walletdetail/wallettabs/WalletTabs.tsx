import { Tabs } from '@/components/ui/tabs';
import { FC, useState } from 'react';
import WalletTransaction from './WalletTransaction';
import WalletTokens from './WalletTokens';
import { Modal } from '@/components/ui/animated-modal';

interface WalletTabsProps {
	wallet: Wallet;
	chainValue: SolanaChain | EthereumChain | null;
	fetchBalance: () => Promise<number | undefined>;
}

const WalletTabs: FC<WalletTabsProps> = ({
	wallet,
	chainValue,
	fetchBalance,
}) => {
	const [selectedTab, setSelectedTab] = useState<TabList>('transactions');
	let content;
	if (selectedTab === 'transactions') {
		content = (
			<WalletTransaction
				chain={chainValue}
				wallet={wallet}
			/>
		);
	} else if (selectedTab === 'tokens') {
		content = (
			<WalletTokens
				pubKey={wallet.publicKey}
				cointype={wallet.coinType}
				chain={chainValue}
				wallet={wallet}
				fetchBalance={fetchBalance}
			/>
		);
	}
	return (
		<div className='flex flex-col gap-5 '>
			<Tabs
				containerClassName='space-x-10 flex-1'
				activeTabClassName='dark:bg-slate-600'
				tabs={[
					{
						title: 'Transactions',
						value: 'transactions',
					},
					{ title: 'Tokens', value: 'tokens' },
				]}
				setSelectedTab={setSelectedTab}
			/>
			<div style={{ minHeight: '100px' }}>
				<Modal>{content}</Modal>{' '}
			</div>
		</div>
	);
};

export default WalletTabs;
