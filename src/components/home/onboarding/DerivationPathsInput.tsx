import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';

interface DerivationPathInputProps {
	basePath: string;
	onPathChange: (updatedPath: string) => void;
}

export const DerivationPathInput: React.FC<DerivationPathInputProps> = ({
	basePath,
	onPathChange,
}) => {
	const [editableValue, setEditableValue] = useState('');
	const debouncedValue = useDebounce(editableValue, 500);

	const pathSegments = basePath.split('/');

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const newValue = e.target.value;

		pathSegments[index] = `${newValue}'`;

		setEditableValue(newValue);
	};
	useEffect(() => {
		onPathChange(debouncedValue);
	}, [debouncedValue]);

	return (
		<div className='flex'>
			{pathSegments.map((segment, index) => {
				const isEditable = segment.includes('x');
				return (
					<div
						key={index}
						className='flex items-center space-x-1'>
						<Input
							type='text'
							value={isEditable ? editableValue : segment}
							onChange={(e) => handleInputChange(e, index)}
							placeholder='x'
							disabled={!isEditable}
							className='p-1 h-10 dark:bg-mybackground-dark dark:text-white'
						/>

						{pathSegments.length !== index + 1 && <p>/</p>}
					</div>
				);
			})}
		</div>
	);
};
