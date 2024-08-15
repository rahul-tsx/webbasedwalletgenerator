import { FC } from 'react';

interface WalletCardProps {
	wallet: Wallet;
	index: number;
}

const WalletCard: FC<WalletCardProps> = ({ wallet, index }) => {
	return (
		<li className='mb-4 '>
			<strong>Wallet {index + 1}:</strong>
			<div>Public Key: {wallet.publicKey}</div>
			<div>Private Key: {wallet.privateKey}</div>
		</li>
	);
};

export default WalletCard;
