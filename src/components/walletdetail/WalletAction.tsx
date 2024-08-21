import StatusContext from '@/context/statusContext';
import { FC, useContext, useRef, useState } from 'react';
import AirdropSection from './AirdropSection';
import { IoIosSend } from 'react-icons/io';
import {
	ModalBody,
	ModalContent,
	ModalFooter,
	useModal,
} from '../ui/animated-modal';
import SendTokenForm from './SendTokenForm';
import { coinUnit } from '@/constants/coinUnit';
import AddReceiverForm from './AddReceiverForm';
import AddReceiverModal from './AddReceiverModal';
import SendTokenModal from './SendTokenModal';

interface WalletActionProps {
	wallet: Wallet;
	tokenBalance: number;
}

const WalletAction: FC<WalletActionProps> = ({ wallet, tokenBalance }) => {
	const context = useContext(StatusContext);
	const [receiverPubKey, setReceiverPubKey] = useState<string | null>(null);
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
	return (
		<div className='grid grid-cols-8'>
			<AirdropSection
				changeStatus={changeStatus}
				wallet={wallet}
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
			{/* <ModalBody modalId='sendTokenModal2'>
				<ModalContent className='gap-5 bg-slate-800'>
					<div className='flex justify-between'>
						<h1 className='text-lg lg:text-2xl font-bold capitalize'>
							Send {coinUnit[wallet.coinType]}
						</h1>
					</div>
					<SendTokenForm
						maxAmount={tokenBalance}
						coinType={wallet.coinType}
					/>
				</ModalContent>
				<ModalFooter className='gap-4 '>
					<button
						onClick={() => closeModal2()}
						className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
						Deny
					</button>
					<button
						onClick={() => closeModal2()}
						className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
						Approve
					</button>
				</ModalFooter>
			</ModalBody> */}
			<SendTokenModal
				modalId={'sendTokenModal2'}
				handleNextClick={handleModal2Click}
				modal2Ref={modal2Ref}
				receiverPubKey={receiverPubKey!}
				onCancel={closeModal2}
				maxAmount={tokenBalance}
				wallet={wallet}
				

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
