import { FC, RefObject } from 'react';
import {
	ModalBody,
	ModalContent,
	ModalFooter,
} from '@/components/ui/animated-modal';
import { coinUnit } from '@/constants/coinUnit';
import MintTokenForm from './MintTokenForm';
interface MintTokenModalProps {
	modalId: string;
	wallet: Wallet;
	onCancel: () => void;
	nextStep: (
		amount: number,
		tokenName: string,
		tokenSymbol: string,
		metadataURI: string,
		decimals: number
	) => void;
	handleNextClick: () => void;
	modal3Ref: RefObject<HTMLButtonElement>;
	loading: boolean;
}

const MintTokenModal: FC<MintTokenModalProps> = ({
	handleNextClick,
	modal3Ref,
	modalId,
	nextStep,
	onCancel,
	loading,
	wallet,
}) => {
	return (
		<ModalBody modalId={modalId}>
			<ModalContent className='gap-5 bg-slate-800 '>
				<div className='flex justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold capitalize'>
						Mint {coinUnit[wallet.coinType]} Token
					</h1>
				</div>

				<MintTokenForm
					closeModal={onCancel}
					nextStep={nextStep}
					ref={modal3Ref}
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
					{!loading && 'Mint'}
					{loading && 'Processing ...'}
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default MintTokenModal;
