import { Dispatch, FC, SetStateAction } from 'react';
import { HoverEffect } from '../ui/card-hover-effect';

interface WalletListProps {
	wallets: Wallet[];
	setStatus: (message: string) => void;
	triggerDeleteWallet: (publicKey: string) => void;
}

const WalletList: FC<WalletListProps> = ({
	triggerDeleteWallet,
	setStatus,
	wallets,
}) => {
	return (
		<>
			{wallets.length === 0 && (
				<p className='col-span-5 col-start-2 text-xl p-2 border-white border text-center rounded-lg my-20'>
					No Wallets Available
				</p>
			)}
			<HoverEffect
				items={wallets}
				setStatus={setStatus}
				deleteWallet={(publicKey: string) => triggerDeleteWallet(publicKey)}
			/>
		</>
	);
};

export default WalletList;
