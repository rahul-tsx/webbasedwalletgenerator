import Pagination from '@/components/Pagination';
import TooltipComponent from '@/components/TooltipComponent';
import StatusContext from '@/context/statusContext';
import usePagination from '@/hooks/usePagination';
import { itemsPerPage, paginationSlots } from '@/lib/constants';
import {
	calculateDaysPassed,
	getSolTransactionDetails,
	getSolTransactionList,
	transactionList,
} from '@/utils/solanaValidation';

import { FC, useContext, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BiCopy } from 'react-icons/bi';

interface WalletTransactionProps {
	wallet: Wallet;
	chain: SolanaChain | EthereumChain | null;
}

const WalletTransaction: FC<WalletTransactionProps> = ({ chain, wallet }) => {
	const [signatures, setSignatures] = useState<transactionList[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const context = useContext(StatusContext);

	const { currentPage, startIndex, endIndex, totalPages, handlePageChange } =
		usePagination(
			itemsPerPage,
			signatures ? signatures.length : 0,
			paginationSlots
		);

	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;

	const fetchTransactions = async () => {
		setLoading(true);
		try {
			const transactionList = await getSolTransactionList(
				wallet.publicKey,
				chain as SolanaChain
			);
			setSignatures(transactionList);
			// const transactionDetails = await getSolTransactionDetails(
			// 	transactionList,
			// 	indexFrom,
			// 	chain as SolanaChain
			// );
			// setIndexFrom((prev) => prev + 12);
			// setTransactions(transactionDetails);
		} catch (error) {
			console.error('Error fetching transactions:', error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (wallet.coinType === 'solana') fetchTransactions();
	},[]);
	return (
		<div className='flex flex-col'>
			<h1 className='text-3xl '>Your Transactions</h1>

			<div className='px-5 bg-slate-800 rounded-lg my-10'>
				{loading ? (
					<p className='text-xl text-center my-5'>Loading transactions...</p>
				) : signatures && signatures.length > 0 ? (
					<div className='bg-slate-800 rounded-lg my-10 grid grid-cols-9'>
						<div className='grid grid-cols-12 col-span-9 font-bold mb-5'>
							<p className='col-span-5'>Signature</p>
							<p className='col-span-2'>Age</p>
							<p className='col-span-4'>Timestamp</p>
							<p>Result</p>
						</div>
						{signatures.slice(startIndex, endIndex).map((transaction) => (
							<div
								key={transaction.transaction.signature}
								className='my-3 grid grid-cols-12 col-span-9'>
								<p className='col-span-5 flex items-center space-x-2'>
									<TooltipComponent
										triggerClassname='truncate max-w-[25ch]'
										fullValue={transaction.transaction.signature}
										triggerValue={transaction.transaction.signature}
									/>
									<CopyToClipboard
										text={transaction.transaction.signature}
										onCopy={() =>
											changeStatus('Signature copied to clipboard!', 'success')
										}>
										<BiCopy className='ml-2 cursor-pointer size-6' />
									</CopyToClipboard>
								</p>

								<p className='col-span-2 flex space-x-2'>
									{`${calculateDaysPassed(
										transaction.transaction.blockTime!
									)} days ago`}
								</p>

								<p className='col-span-4'>
									{transaction.transaction.blockTime
										? new Date(
												transaction.transaction.blockTime * 1000
										  ).toUTCString()
										: new Date().toLocaleDateString()}
								</p>
								<p>{transaction.transaction.confirmationStatus}</p>
							</div>
						))}
					</div>
				) : (
					<p className='text-xl text-center bg-slate-800 rounded-lg my-5'>
						No transactions yet
					</p>
				)}
				{signatures && signatures.length > itemsPerPage && (
					<Pagination
						currentPage={currentPage}
						dataLength={signatures.length}
						endIndex={endIndex}
						handlePageChange={handlePageChange}
						paginationSlots={paginationSlots}
						startIndex={startIndex}
						totalPages={totalPages}
					/>
				)}
			</div>
		</div>
	);
};

export default WalletTransaction;
