'use client';
import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalProvider,
	ModalTrigger,
	useModal,
} from '@/components/ui/animated-modal';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Input } from '@/components/ui/input';
import { generateMnemonic } from 'bip39';
import { BiCopy } from 'react-icons/bi';
import AlertBox from './AlertBox';

interface MnemonicGenratorProps {
	setMnemonic: Dispatch<SetStateAction<string>>;
	setStatus: (message: string, variant?: variantTypes) => void;
	mnemonic: string;
}

const MnemonicGenrator: FC<MnemonicGenratorProps> = ({
	setMnemonic,
	setStatus,
	mnemonic,
}) => {
	const { isOpen,closeModal,openModal } = useModal("mneumonicModal")
	const [alertOpen, setAlertOpen] = useState(false);

	const triggerAlertBox = () => {
		setAlertOpen(true);
	};
	const handleConfirm = () => {
		closeModal();
	};

	const handleGenerateMnemonic = () => {
		const secretPhrase = generateMnemonic();
		setMnemonic(secretPhrase);
		openModal();
	};

	return (
		<div className='grid grid-cols-7 w-full '>
			<div className='col-span-7 grid grid-cols-12 gap-x-5 '>
				{/* <Input
					className='col-span-8  rounded-[6px]'
					type='password'
					placeholder='Enter your secret pharse (Or leave blank to generate )'
					onChange={(e) => setMnemonic(e.target.value)}
				/> */}
				<button
					onClick={handleGenerateMnemonic}
					className=' col-span-4 col-start-5 relative inline-flex overflow-hidden rounded-[6px] p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
					<span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FFFF_0%,#A855F7_50%,#00FFFF_100%)]' />
					<span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[6px]  bg-mybackground-dark px-3 py-3  text-lg font-medium text-white backdrop-blur-3xl'>
						Generate Mneumonic
					</span>
				</button>
			</div>

			<ModalBody modalId='mneumonicModal'>
				<ModalContent className='gap-5 bg-slate-800'>
					<div className='flex justify-between'>
						<h1 className='text-lg lg:text-2xl font-bold'>
							Your Secret Phrase
						</h1>
						<CopyToClipboard
							text={mnemonic}
							onCopy={() => setStatus('Secret Phrase copied to clipboard!','success')}>
							<BiCopy className='ml-2 cursor-pointer size-10' />
						</CopyToClipboard>
					</div>

					<ul className='grid lg:grid-cols-2 xl:grid-cols-3  gap-y-10 gap-x-5 max-h-[200px] md:max-h-[250px] xl:max-h-[350px] overflow-y-auto scrollbar-dark '>
						{mnemonic.split(' ').map((word, index) => (
							<li
								key={index}
								className='p-2 bg-slate-950 hover:bg-opacity-50 rounded-[6px] px-5'>
								{index + 1}. {word}
							</li>
						))}
					</ul>
					<p className='text-red-500'>
						Important: Copy and store your mnemonic securely. This is the only
						way to recover your wallets. If lost, your funds cannot be
						retrieved.Do not share it with anyone{' '}
					</p>
				</ModalContent>
				<ModalFooter className='gap-4 '>
					<button
						onClick={triggerAlertBox}
						className='px-2 py-1 bg-gray-200 text-black dark:bg-slate-800 dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 text-center'>
						Close
					</button>
				</ModalFooter>
			</ModalBody>

			<AlertBox
				open={alertOpen}
				setOpen={setAlertOpen}
				onConfirm={handleConfirm}
				title='Have You Saved Your Secret Phrase?'
				description={`Your secret phrase is essential for accessing your wallets. If you haven't copied or noted it down, you won't be able to recover your wallets in the future. This is your only opportunity to save it. Are you sure you want to exit?`}
			/>
		</div>
	);
};

export default MnemonicGenrator;
