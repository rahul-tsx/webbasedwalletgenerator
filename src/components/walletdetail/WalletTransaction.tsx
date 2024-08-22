import { FC } from 'react';

interface WalletTransactionProps {}

const WalletTransaction: FC<WalletTransactionProps> = ({}) => {
	const transactions = [];
	return (
		<div className='flex flex-col'>
			<h1 className='text-3xl md:text-[40px]'>Your Transactions</h1>
      {transactions.length===0 && <p className='text-xl text-center p-5 bg-slate-800 rounded-lg my-10'>No transactions yet</p>}
		</div>
	);
};

export default WalletTransaction;
