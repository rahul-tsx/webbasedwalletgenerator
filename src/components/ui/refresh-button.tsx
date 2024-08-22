import { FC } from 'react';
import React, { useState } from 'react';
import { BiRefresh } from 'react-icons/bi';

interface RefreshButtonProps {
	onClick: () => void;
	duration?: number;
	text?: string;
}

const RefreshButton: FC<RefreshButtonProps> = ({
	onClick,
	duration = 1000,
	text = 'Refresh',
}) => {
	const [isRotating, setIsRotating] = useState(false);

	const handleClick = () => {
		setIsRotating(true);
		onClick();

		setTimeout(() => {
			setIsRotating(false);
		}, duration);
	};
	return (
		<button
			onClick={handleClick}
			disabled={isRotating}
			className='focus:outline-none p-2 px-4 flex items-center w-full rounded-lg space-x-2 disabled:cursor-not-allowed border hover:border-white disabled:border-border '>
			<BiRefresh
				size={25}
				className={isRotating ? 'animate-spin' : ''}
			/>
			<span>{text}</span>
		</button>
	);
};

export default RefreshButton;
