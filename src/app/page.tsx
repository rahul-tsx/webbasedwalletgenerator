'use client';
import MnemonicGenrator from '@/components/MnemonicGenrator';
import { Modal } from '@/components/ui/animated-modal';
import WalletsSection from '@/components/wallets/WalletsSection';
import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { toast } from 'sonner';

export default function Home() {
	const [mnemonic, setMnemonic] = useState('');
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		if (status) {
			toast(status, {
				action: {
					label: <CgClose size={10} />,
					onClick: () => {},
				},
			});

			const timeout = setTimeout(() => {
				setStatus(null);
			}, 2000);

			return () => clearTimeout(timeout);
		}
	}, [status, setStatus]);
	return (
		<main className='flex flex-col items-center myContainer justify-between py-10 gap-10 '>
			<Modal>
				<MnemonicGenrator
					setMnemonic={setMnemonic}
					mnemonic={mnemonic}
					setStatus={setStatus}
				/>
			</Modal>
			<Modal>
				<WalletsSection
					mnemonic={mnemonic}
					setStatus={setStatus}
				/>
			</Modal>
		</main>
	);
}
