import { Tabs } from '@/components/ui/tabs';
import { FC, useState } from 'react';
import WalletTransaction from './WalletTransaction';
import WalletTokens from './WalletTokens';

interface WalletTabsProps {
	wallet: Wallet;
}

const WalletTabs: FC<WalletTabsProps> = ({ wallet }) => {
	const [selectedTab, setSelectedTab] = useState<TabList>('transactions');
	let content;
	if (selectedTab === 'transactions') {
		content = <WalletTransaction />;
	} else if (selectedTab === 'tokens') {
		content = (
			<WalletTokens
				pubKey={wallet.publicKey}
				cointype={wallet.coinType}
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
			<div style={{ minHeight: '100px' }}> {content}</div>
		</div>
	);
};

export default WalletTabs;
