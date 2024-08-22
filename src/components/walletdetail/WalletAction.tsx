import StatusContext from '@/context/statusContext';
import { FC, useContext, useRef, useState } from 'react';
import AirdropSection from './AirdropSection';
import { IoIosSend } from 'react-icons/io';
import { useModal } from '../ui/animated-modal';
import AddReceiverModal from './AddReceiverModal';
import SendTokenModal from './SendTokenModal';
import { sendSol } from '@/utils/solanaValidation';
import { sendEth } from '@/utils/ethereumValidation';

interface WalletActionProps {
	wallet: Wallet;
	tokenBalance: number;
	chainValue: SolanaChain | EthereumChain | null;
}

const WalletAction: FC<WalletActionProps> = ({
	wallet,
	tokenBalance,
	chainValue,
}) => {
	const context = useContext(StatusContext);
	const [receiverPubKey, setReceiverPubKey] = useState<string | null>(null);
	const [amountToSend, setAmountToSend] = useState<number>(0);
	const [loading, setLoading] = useState(false);
	const {
		isOpen: isOpen1,
		closeModal: closeModal1,
		openModal: openModal1,
	} = useModal('selectReceiverModal1');
	const {
		isOpen: isOpen2,
		closeModal: closeModal2,
		openModal: openModal2,
	} = useModal('sendTokenModal2');

	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;
	const modal1Ref = useRef<HTMLButtonElement>(null);
	const modal2Ref = useRef<HTMLButtonElement>(null);

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
			<AirdropSection
				changeStatus={changeStatus}
				wallet={wallet}
				chainValue={chainValue}
			/>
			<button
				className='col-span-2 col-start-6 border bg-white text-mybackground-dark font-bold p-2 px-4 flex items-center w-full rounded-lg space-x-2 justify-center group'
				onClick={() => openModal1()}>
				<span>Send Token</span>{' '}
				<IoIosSend
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
		</div>
	);
};

export default WalletAction;
