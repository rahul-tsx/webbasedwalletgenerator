import { Dispatch, FC, SetStateAction } from 'react';
import DropdownMenu from '@/components/home/onboarding/CoinDropDownComponent';

interface CoinSelectionDropDownProps {
	value: coinTypes;
	setValue: Dispatch<SetStateAction<coinTypes>>;
}

const CoinSelectionDropDown: FC<CoinSelectionDropDownProps> = ({
	setValue,
	value,
}) => {
	let defaultValue: coinTypes = 'solana';

	return (
		<div>
			<DropdownMenu
				defaultCoin={defaultValue}
				value={value}
				setValue={setValue}
			/>
		</div>
	);
};

export default CoinSelectionDropDown;
