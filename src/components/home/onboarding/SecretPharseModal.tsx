import { useState, useEffect, FC } from 'react';
import {
	ModalBody,
	ModalContent,
	ModalFooter,
} from '@/components/ui/animated-modal';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { generateMnemonic } from 'bip39';
import { BiCopy } from 'react-icons/bi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface SecretPharseModalProps {
	modalId: string;
	setStatus: (message: string, variant?: variantTypes) => void;
	closeModal: () => void;
	nextStep: (secret: string) => void;
}

const SecretPharseModal: FC<SecretPharseModalProps> = ({
	setStatus,
	modalId,
	closeModal,
	nextStep,
}) => {
	const [mnemonic, setMnemonic] = useState<string | null>(null);
	const [isBlurred, setIsBlurred] = useState<boolean>(true);

	const handleGenerateMnemonic = () => {
		const secretPhrase = generateMnemonic();
		setMnemonic(secretPhrase);
	};

	useEffect(() => {
		handleGenerateMnemonic();
	}, []);

	const toggleBlur = () => {
		setIsBlurred(!isBlurred);
	};
	const handleNext = () => {
		setIsBlurred(true);
		nextStep(mnemonic!);
	};
	return (
		<ModalBody modalId={modalId}>
			{!mnemonic && <p className='text-center'>Loading...</p>}
			{mnemonic && (
				<ModalContent className='gap-5 bg-slate-800'>
					<div className='flex justify-between'>
						<h1 className='text-lg lg:text-2xl font-bold'>
							Your Primary Secret Phrase
						</h1>
						<div className='flex items-center'>
							<CopyToClipboard
								text={mnemonic}
								onCopy={() =>
									setStatus('Secret Phrase copied to clipboard!', 'success')
								}>
								<BiCopy className='ml-2 cursor-pointer size-10' />
							</CopyToClipboard>
						</div>
					</div>
					<div className='relative my-2'>
						<button
							onClick={toggleBlur}
							className='ml-2 absolute z-10 left-1/2 top-1/2'>
							{isBlurred ? (
								<FaEye className='size-6' />
							) : (
								<FaEyeSlash className='size-6' />
							)}
						</button>
						<ul
							className={`grid lg:grid-cols-2 xl:grid-cols-3 gap-y-10 gap-x-5 max-h-[200px] md:max-h-[250px] xl:max-h-[350px] overflow-y-auto ${
								isBlurred ? 'filter blur-sm' : ''
							}`}>
							{mnemonic.split(' ').map((word, index) => (
								<li
									key={index}
									className='p-2 bg-slate-950 hover:bg-opacity-50 rounded-[6px] px-5'>
									{index + 1}. {word}
								</li>
							))}
						</ul>
					</div>

					<button
						onClick={handleGenerateMnemonic}
						className='col-span-4 col-start-5 md:max-w-[200px] mx-auto relative inline-flex overflow-hidden rounded-[6px] p-[1px] focus:outline-none '>
						<span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FFFF_0%,#A855F7_50%,#00FFFF_100%)]' />
						<span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[6px]  bg-mybackground-dark px-3 py-3  text-lg font-medium text-white backdrop-blur-3xl'>
							Refresh Mneumonic
						</span>
					</button>
					<p className='text-red-500'>
						Important: Copy and store your mnemonic securely. This is the only
						way to recover your wallets. If lost, your funds cannot be
						retrieved. Do not share it with anyone{' '}
					</p>
				</ModalContent>
			)}

			<ModalFooter className='gap-4 '>
				<button
					onClick={() => {
						closeModal();
						setIsBlurred(true);
					}}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					back
				</button>
				<button
					onClick={handleNext}
					className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
					Next
				</button>
			</ModalFooter>
		</ModalBody>
	);
};

export default SecretPharseModal;
