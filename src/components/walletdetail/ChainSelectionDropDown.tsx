import { Dispatch, FC, SetStateAction } from 'react';
import DropdownMenu from '../ui/dropdown';
import { coinChain } from '@/constants/coinUnit';

interface ChainSelectionDropDownProps {
	coinType: coinTypes;
	value: SolanaChain | EthereumChain | null;
	setValue: Dispatch<SetStateAction<SolanaChain | EthereumChain | null>>;
}

const ChainSelectionDropDown: FC<ChainSelectionDropDownProps> = ({
	coinType,
	setValue,
	value,
}) => {
	let defaultValue: SolanaChain | EthereumChain;
	if (coinType === 'solana') {
		defaultValue = 'devnet';
	} else if (coinType === 'ethereum') {
		defaultValue = 'sepolia';
	}
	return (
		<div>
			<DropdownMenu
				dropdownValue={coinChain[coinType]}
				defaultChain={defaultValue!}
				value={value}
				setValue={setValue}
			/>
		</div>
	);
};

export default ChainSelectionDropDown;
