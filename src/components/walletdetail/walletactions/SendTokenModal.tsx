import { coinUnit } from '@/lib/constants';
import { Dispatch, FC, RefObject, SetStateAction } from 'react';
import { ModalBody, ModalContent, ModalFooter } from '../../ui/animated-modal';
import SendTokenForm from './SendTokenForm';

interface SendTokenModalProps {
	modalId: string;
	wallet: Wallet;
	maxAmount: number;
	receiverPubKey: string;
	onCancel: () => void;
	handleNextClick: () => void;
	modal2Ref: RefObject<HTMLButtonElement>;
	setAmountToSend: Dispatch<SetStateAction<number>>;
	sendToken: (amount: number) => void;
	loading: boolean;
}

const SendTokenModal: FC<SendTokenModalProps> = ({
	modalId,
	wallet,
	receiverPubKey,
	onCancel,
	handleNextClick,
	modal2Ref,
	maxAmount,
	setAmountToSend,
	sendToken,
	loading,
}) => {
	return (
		<ModalBody modalId={modalId}>
			<ModalContent className='gap-2 bg-slate-800 min-h-[500px]'>
				<div className='flex justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold capitalize'>
						Send {coinUnit[wallet.coinType]}
					</h1>
				</div>
				<SendTokenForm
					senderPubKey={wallet.publicKey}
					maxAmount={maxAmount}
					coinType={wallet.coinType}
					receiverPubKey={receiverPubKey}
					setAmountToSend={setAmountToSend}
					ref={modal2Ref}
					sendToken={sendToken}
				/>
			</ModalContent>
			<ModalFooter className='gap-4 '>
				<button
					onClick={onCancel}
					disabled={loading}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					Deny
				</button>
				<button
					onClick={handleNextClick}
					disabled={loading}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					{!loading && 'Approve'}
					{loading && 'Processing ...'}
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default SendTokenModal;
