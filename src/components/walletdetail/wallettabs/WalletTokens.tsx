import TooltipComponent from '@/components/TooltipComponent';
import StatusContext from '@/context/statusContext';
import {
	getAccountTokens,
	getSolBalance,
	transferMintedToken,
} from '@/utils/solanaValidation';
import { TbTransfer, TbTransferVertical } from 'react-icons/tb';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { BiCopy } from 'react-icons/bi';
import { useModal } from '@/components/ui/animated-modal';
import TransferMintedTokenModal from './TransferMintedTokenModal';
import AddReceiverForTokenModal from './AddReceiverForTokenModal';
import Pagination from '@/components/Pagination';
import usePagination from '@/hooks/usePagination';
import { itemsPerPage, paginationSlots } from '@/lib/constants';

interface WalletTokensProps {
	pubKey: string;
	cointype: coinTypes;
	chain: SolanaChain | EthereumChain | null;
	wallet: Wallet;
	fetchBalance: () => Promise<number | undefined>;
}

const WalletTokens: FC<WalletTokensProps> = ({
	pubKey,
	cointype,
	chain,
	wallet,
	fetchBalance,
}) => {
	const [tokens, setTokens] = useState<TokenData[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [currentToken, setCurrentToken] = useState<TokenData | null>(null);
	const [receiverPubKey, setReceiverPubKey] = useState<string | null>(null);
	const context = useContext(StatusContext);

	const { currentPage, startIndex, endIndex, totalPages, handlePageChange } =
		usePagination(itemsPerPage, tokens ? tokens.length : 0, paginationSlots);

	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;
	const { closeModal: closeModal1, openModal: openModal1 } = useModal(
		'addReceiverTokenModal1'
	);
	const modal1Ref = useRef<HTMLButtonElement>(null);
	const handleModal1Click = () => {
		if (modal1Ref.current) {
			modal1Ref.current.click();
		}
	};
	const { closeModal: closeModal2, openModal: openModal2 } = useModal(
		'transferTokenModal2'
	);
	const modal2Ref = useRef<HTMLButtonElement>(null);
	const handleModal2Click = () => {
		if (modal2Ref.current) {
			modal2Ref.current.click();
		}
	};
	const fetchSolBalance = async () => {
		const balance = await fetchBalance();
		if (balance === undefined || balance <= 0.00001) return false;
		return true;
	};
	const handleTransferClick = async (token: TokenData) => {
		setCurrentToken(token);

		if (cointype === 'ethereum') {
			changeStatus('Minting not available in Ethereum chain yet', 'warning');
		} else if (cointype === 'solana') {
			const balanceAvailable = await fetchSolBalance();
			if (balanceAvailable) {
				openModal1();
			} else {
				changeStatus('Insufficient Sol to transfer token', 'warning');
			}
		}
	};

	const sendSplToken = async (amount: number) => {
		setLoading(true);

		try {
			const signature = await transferMintedToken(
				chain as SolanaChain,
				wallet.privateKey,
				receiverPubKey!,
				currentToken!.mintAddress.mint,
				amount
			);
			fetchBalance();
			fetchTokens();

			changeStatus(`Token transfer Successful: ${signature}`, 'success');
		} catch (error) {
			console.log(error);
			changeStatus(`Token transfer failed`, 'error');
		} finally {
			setLoading(false);
			closeModal2();
		}
	};

	const fetchTokens = async () => {
		setLoading(true);
		try {
			const fetchedTokens = await getAccountTokens(
				pubKey,
				chain as SolanaChain
			);
			// const duplicateTokens = [
			// 	...fetchedTokens!,
			// 	...fetchedTokens!,
			// 	...fetchedTokens!,
			// 	...fetchedTokens!,
			// ];

			setTokens(fetchedTokens);
		} catch (error) {
			console.error('Error fetching tokens:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (cointype === 'solana') fetchTokens();
	}, [pubKey, chain]);

	return (
		<div className='flex flex-col'>
			<TransferMintedTokenModal
				modalId={'transferTokenModal2'}
				handleNextClick={handleModal2Click}
				nextStep={sendSplToken}
				onCancel={closeModal2}
				loading={loading}
				token={currentToken}
				modal2Ref={modal2Ref}
				receiverPubKey={receiverPubKey!}
				senderPubKey={wallet.publicKey}
			/>
			<AddReceiverForTokenModal
				handleNextClick={handleModal1Click}
				modal1Ref={modal1Ref}
				modalId='addReceiverTokenModal1'
				nextStep={openModal2}
				onCancel={closeModal1}
				setReceiverPubKey={setReceiverPubKey}
				tokenName={currentToken?.tokenMetadataInfo?.name || ''}
				wallet={wallet}
			/>
			<h1 className='text-3xl '>Your Tokens</h1>
			<div className='px-5 bg-slate-800 rounded-lg my-10'>
				{loading ? (
					<p className='text-xl text-center my-5'>Loading tokens...</p>
				) : tokens && tokens.length > 0 ? (
					<div className='bg-slate-800 rounded-lg my-10 grid grid-cols-9'>
						<div className='grid grid-cols-12 col-span-9 font-bold mb-5'>
							<p className='col-span-3'>Token Name</p>
							<p className='col-span-5'>Mint Address</p>
							<p className='col-span-3'>Amount</p>
							<p>Action</p>
						</div>
						{tokens.slice(startIndex, endIndex).map((token) => (
							<div
								key={token.mintAddress.mint}
								className='my-3 grid grid-cols-12 col-span-9'>
								<p className='col-span-3 flex items-center space-x-2'>
									{token.imageUrl && (
										<div className='size-10 rounded-full bg-slate-950 text-neonYellow'>
											<img
												alt='tokenImage'
												src={token.imageUrl}
												className='size-10'
												width={10}
												height={10}
											/>
										</div>
									)}
									{!token.imageUrl && (
										<div className='size-10 rounded-full bg-slate-950 text-neonYellow items-center flex justify-center font-bold cursor-default'>
											<span>UT</span>
										</div>
									)}

									<span>
										{token.tokenMetadataInfo
											? token.tokenMetadataInfo.name
											: 'Unknown Token'}
									</span>
								</p>
								<p className='col-span-5 flex space-x-2'>
									<TooltipComponent
										triggerClassname='truncate max-w-[20ch]'
										fullValue={token.mintAddress.mint}
										triggerValue={token.mintAddress.mint}
									/>

									<CopyToClipboard
										text={token.mintAddress.mint}
										onCopy={() =>
											changeStatus(
												'Token Address copied to clipboard!',
												'success'
											)
										}>
										<BiCopy className='ml-2 cursor-pointer size-6' />
									</CopyToClipboard>
								</p>

								<p className='col-span-3'>
									{token.mintAddress.amount} {token.tokenMetadataInfo?.symbol}
								</p>
								<p>
									<TbTransferVertical
										size={25}
										onClick={() => handleTransferClick(token)}
									/>
								</p>
							</div>
						))}
					</div>
				) : (
					<p className='text-xl text-center bg-slate-800 rounded-lg my-5'>
						No tokens yet
					</p>
				)}
				{tokens && tokens.length > itemsPerPage && (
					<Pagination
						currentPage={currentPage}
						dataLength={tokens.length}
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

export default WalletTokens;
