import { FC } from 'react';
import { ModalBody, ModalContent, ModalFooter } from '../ui/animated-modal';
import { Button } from '../ui/button';

interface SelectActionModalProps {
	modalId: string;
	importWallet: () => void;
	generateWallet: () => void;
}

const SelectActionModal: FC<SelectActionModalProps> = ({
	generateWallet,
	importWallet,
	modalId,
}) => {
	return (
		<ModalBody
			modalId={modalId}
			className='min-h-fit lg:max-w-[40%] 2xl:max-w-[30%]'>
			<ModalContent className='gap-5 bg-slate-800 '>
				<div className='flex justify-between flex-col items-center'>
					<h1 className='text-lg lg:text-2xl font-bold capitalize'>
						Select your action
					</h1>
					<div className='flex flex-col gap-10  mx-auto my-10'>
						<Button
							className='w-full md:min-w-[350px]'
							onClick={generateWallet}>
							Generate Wallet
						</Button>
						<Button
							className='w-full md:min-w-[350px]'
							onClick={importWallet}>
							Import Wallet
						</Button>
					</div>
				</div>
			</ModalContent>
		</ModalBody>
	);
};

export default SelectActionModal;
