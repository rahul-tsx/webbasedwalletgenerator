import StatusContext from '@/context/statusContext';
import {
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useRef,
	useState,
} from 'react';
import AirdropSection from './walletactions/AirdropSection';
import { IoIosSend } from 'react-icons/io';
import { useModal } from '../ui/animated-modal';
import AddReceiverModal from './walletactions/AddReceiverModal';
import SendTokenModal from './walletactions/SendTokenModal';
import { createTokenAndMint, sendSol } from '@/utils/solanaValidation';
import { sendEth } from '@/utils/ethereumValidation';
import { VscGitPullRequestCreate } from 'react-icons/vsc';
import MintTokenModal from './walletactions/MintTokenModal';

interface WalletActionProps {
	wallet: Wallet;
	tokenBalance: number;
	chainValue: SolanaChain | EthereumChain | null;
	setAmountToSend: Dispatch<SetStateAction<number>>;
	fetchBalance: () => void;
}

const WalletAction: FC<WalletActionProps> = ({
	wallet,
	tokenBalance,
	chainValue,
	setAmountToSend,
	fetchBalance,
}) => {
	const context = useContext(StatusContext);
	const [receiverPubKey, setReceiverPubKey] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { closeModal: closeModal1, openModal: openModal1 } = useModal(
		'selectReceiverModal1'
	);
	const { closeModal: closeModal2, openModal: openModal2 } =
		useModal('sendTokenModal2');
	const { closeModal: closeModal3, openModal: openModal3 } =
		useModal('mintTokenModal3');

	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;
	const modal1Ref = useRef<HTMLButtonElement>(null);
	const modal2Ref = useRef<HTMLButtonElement>(null);
	const modal3Ref = useRef<HTMLButtonElement>(null);

	const handleModal1Click = () => {
		if (modal1Ref.current) {
			modal1Ref.current.click();
		}
	};
	const handleModal2Click = () => {
		if (modal2Ref.current) {
			modal2Ref.current.click();
		}
	};
	const handleModal3Click = () => {
		if (modal3Ref.current) {
			modal3Ref.current.click();
		}
	};
	const handleMintModal = () => {
		if (wallet.coinType === 'ethereum') {
			changeStatus('Minting not available in Ethereum chain yet', 'warning');
		} else if (wallet.coinType === 'solana') {
			openModal3();
		}
	};
	const mintToken = async (
		amount: number,
		tokenName: string,
		tokenSymbol: string,
		metadataURI: string,
		decimals: number
	) => {
		setLoading(true);
		try {
			const mint = await createTokenAndMint(
				wallet.privateKey,
				amount,
				tokenName,
				tokenSymbol,
				metadataURI,
				decimals
			);
			fetchBalance();
			changeStatus(`Token ${mint} Minted`, 'success');
		} catch (error) {
			console.log(error);
			changeStatus(`Transaction Failed:Token not minted`, 'error');
		} finally {
			setLoading(false);
			closeModal3();
		}
	};
	const sendToken = async (amount: number) => {
		setLoading(true);
		if (wallet.coinType === 'solana') {
			try {
				const signature = await sendSol(
					wallet.privateKey,
					receiverPubKey!,
					amount,
					chainValue as SolanaChain
				);
				fetchBalance();

				changeStatus(`Transaction Successful: ${signature}`, 'success');
			} catch (error) {
				console.log(error);
				changeStatus(`Transaction Failed`, 'error');
			} finally {
				setLoading(false);
				closeModal2();
			}
		}
		if (wallet.coinType === 'ethereum') {
			try {
				const signature = await sendEth(
					wallet.privateKey,
					receiverPubKey!,
					amount,
					chainValue as EthereumChain
				);
				fetchBalance();
				changeStatus(`Transaction Successful: ${signature}`, 'success');
			} catch (error) {
				console.log(error);
				changeStatus(`Transaction Failed`, 'error');
			} finally {
				setLoading(false);
				closeModal2();
			}
		}
	};
	return (
		<div className='grid grid-cols-8'>
			<button
				className='col-span-2 border bg-white text-mybackground-dark font-bold p-2 px-4 flex items-center w-full rounded-lg space-x-2 justify-center group'
				onClick={() => openModal1()}>
				<span>Send Token</span>{' '}
				<IoIosSend
					size={25}
					className='group-hover:scale-125 transition-all'
				/>
			</button>
			<AirdropSection
				changeStatus={changeStatus}
				wallet={wallet}
				chainValue={chainValue}
				fetchBalance={fetchBalance}
			/>
			<button
				className='col-span-2 col-start-7 border bg-white text-mybackground-dark font-bold p-2 px-4 flex items-center w-full rounded-lg space-x-2 justify-center group'
				onClick={handleMintModal}>
				<span>Mint Token</span>{' '}
				<VscGitPullRequestCreate
					size={25}
					className='group-hover:scale-125 transition-all'
				/>
			</button>

			<SendTokenModal
				modalId={'sendTokenModal2'}
				handleNextClick={handleModal2Click}
				modal2Ref={modal2Ref}
				receiverPubKey={receiverPubKey!}
				onCancel={closeModal2}
				maxAmount={tokenBalance}
				wallet={wallet}
				setAmountToSend={setAmountToSend}
				sendToken={sendToken}
				loading={loading}
			/>
			<AddReceiverModal
				modalId={'selectReceiverModal1'}
				handleNextClick={handleModal1Click}
				nextStep={openModal2}
				onCancel={closeModal1}
				setReceiverPubKey={setReceiverPubKey}
				wallet={wallet}
				modal1Ref={modal1Ref}
			/>
			<MintTokenModal
				modalId={'mintTokenModal3'}
				handleNextClick={handleModal3Click}
				nextStep={mintToken}
				onCancel={closeModal3}
				wallet={wallet}
				modal3Ref={modal3Ref}
				loading={loading}
			/>
		</div>
	);
};

export default WalletAction;
