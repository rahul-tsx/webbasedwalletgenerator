import { FC, RefObject } from 'react';
import {
	ModalBody,
	ModalContent,
	ModalFooter,
} from '@/components/ui/animated-modal';
import TransferMintedTokenForm from './TransferMintedTokenForm';

interface TransferMintedTokenModalProps {
	modalId: string;
	onCancel: () => void;
	nextStep: (amount: number) => void;
	handleNextClick: () => void;
	modal2Ref: RefObject<HTMLButtonElement>;
	loading: boolean;
	token: TokenData | null;
	receiverPubKey: string;
	senderPubKey: string;
}

const TransferMintedTokenModal: FC<TransferMintedTokenModalProps> = ({
	handleNextClick,
	modal2Ref,
	modalId,
	nextStep,
	onCancel,
	loading,
	token,
	receiverPubKey,
	senderPubKey,
}) => {
	return (
		<ModalBody modalId={modalId}>
			<ModalContent className='gap-5 bg-slate-800 '>
				<div className='flex justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold capitalize'>
						Transfer {token?.tokenMetadataInfo?.name || ''} Token
					</h1>
				</div>

				<TransferMintedTokenForm
					receiverPubKey={receiverPubKey}
					token={token!}
					senderPubKey={senderPubKey}
					sendToken={nextStep}
					ref={modal2Ref}
				/>
			</ModalContent>
			<ModalFooter className='gap-4 '>
				<button
					onClick={onCancel}
					disabled={loading}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					cancel
				</button>
				<button
					onClick={handleNextClick}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					{!loading && 'Transfer'}
					{loading && 'Processing ...'}
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default TransferMintedTokenModal;
