'use client';
import { FC } from 'react';
import MnemonicGenrator from '@/components/MnemonicGenrator';
import { Modal } from '@/components/ui/animated-modal';
import WalletsSection from '@/components/wallets/WalletsSection';
import StatusContext from '@/context/statusContext';
import { useContext, useState } from 'react';

interface WalletPageProps {}

const WalletPage: FC<WalletPageProps> = ({}) => {
	const [mnemonic, setMnemonic] = useState('');
	const context = useContext(StatusContext);

	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;
	return (
		<main className='flex flex-col items-center myContainer justify-between py-10 gap-10 '>
			{/* <Modal>
				<MnemonicGenrator
					setMnemonic={setMnemonic}
					mnemonic={mnemonic}
					setStatus={changeStatus}
				/>
			</Modal> */}
			<Modal>
				<WalletsSection
					mnemonic={mnemonic}
					setStatus={changeStatus}
				/>
			</Modal>
		</main>
	);
};

export default WalletPage;
