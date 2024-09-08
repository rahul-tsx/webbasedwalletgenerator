import { FC } from 'react';
import {
	ModalBody,
	ModalContent,
	ModalFooter,
} from '@/components/ui/animated-modal';
import { FaEye } from 'react-icons/fa';
import { Button } from '../ui/button';
import CopyToClipboard from 'react-copy-to-clipboard';
import { BiCopy } from 'react-icons/bi';

interface ShowPrivKeyModalProps {
	modalId: string;
	closeModal: () => void;
	privKey: string;
	setStatus: (message: string, variant: variantTypes) => void;
}

const ShowPrivKeyModal: FC<ShowPrivKeyModalProps> = ({
	modalId,
	closeModal,
	
	privKey,
	setStatus,
}) => {
	

	return (
		<ModalBody modalId={modalId}>
			<ModalContent className='gap-5 bg-slate-800'>
				<div className='flex justify-between'>
					<h1 className='text-lg lg:text-2xl font-bold'>Private Key</h1>
				</div>
				<FaEye
					size={45}
					className='mx-auto'
				/>
				<p className='text-center text-3xl font-bold '>Your Private Key</p>
				<p className='text-center'>
					Never give out your private key to someone
				</p>
				<div className='rounded-md border dark:border-white w-3/4 xl:w-1/2 mx-auto my-5'>
					<p className='p-5 text-wrap break-words '>{privKey}</p>
				</div>
				<Button className='max-w-[500px] min-w-[300px] mx-auto p-5 px-10 w-full'>
					<CopyToClipboard
						text={privKey}
						onCopy={() =>
							setStatus('Private key copied to clipboard!', 'success')
						}>
						<p className='flex space-x-2 items-center text-lg'>
							Copy <BiCopy className='ml-2 cursor-pointer size-6' />
						</p>
					</CopyToClipboard>
				</Button>
			</ModalContent>

			<ModalFooter className='gap-4'>
				<button
					onClick={closeModal}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					close
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default ShowPrivKeyModal;
