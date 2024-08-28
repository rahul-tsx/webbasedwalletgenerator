import TooltipComponent from '@/components/TooltipComponent';
import StatusContext from '@/context/statusContext';
import { getAccountTokens } from '@/utils/solanaValidation';
import { TbTransfer, TbTransferVertical } from 'react-icons/tb';
import { FC, useContext, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { BiCopy } from 'react-icons/bi';

interface WalletTokensProps {
	pubKey: string;
	cointype: coinTypes;
	chain: SolanaChain | EthereumChain | null;
}

const WalletTokens: FC<WalletTokensProps> = ({ pubKey, cointype, chain }) => {
	const [tokens, setTokens] = useState<TokenData[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const context = useContext(StatusContext);

	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;

	useEffect(() => {
		const fetchTokens = async () => {
			setLoading(true);
			const fetchedTokens = await getAccountTokens(
				pubKey,
				chain as SolanaChain
			);
			setTokens(fetchedTokens);
			setLoading(false);
		};
		if (cointype === 'solana') fetchTokens();
	}, [pubKey, chain]);
	return (
		<div className='flex flex-col'>
			<h1 className='text-3xl '>Your Tokens</h1>
			{loading ? (
				<p className='text-xl text-center p-5 bg-slate-800 rounded-lg my-10'>
					Loading tokens...
				</p>
			) : tokens && tokens.length > 0 ? (
				<div className='bg-slate-800 rounded-lg my-10 grid grid-cols-9'>
					<div className='grid grid-cols-12 col-span-9 p-5 font-bold'>
						<p className='col-span-3'>Token Name</p>
						<p className='col-span-5'>Mint Address</p>
						<p className='col-span-3'>Amount</p>
						<p>Action</p>
					</div>
					{tokens.map((token) => (
						<div
							key={token.mintAddress.mint}
							className='p-5 grid grid-cols-12 col-span-9 '>
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
								<TbTransferVertical size={25} />
							</p>
						</div>
					))}
				</div>
			) : (
				<p className='text-xl text-center p-5 bg-slate-800 rounded-lg my-10'>
					No tokens yet
				</p>
			)}
		</div>
	);
};

export default WalletTokens;
