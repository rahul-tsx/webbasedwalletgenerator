'use client';

import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useState,
	useRef,
} from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { coinList } from '@/lib/constants';

interface DropdownProps {
	defaultCoin: coinTypes;
	value: coinTypes;
	setValue: Dispatch<SetStateAction<coinTypes>>;
}

const DropdownMenu: FC<DropdownProps> = ({
	defaultCoin = 'solana',
	setValue,
	value,
}) => {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		setValue(defaultCoin);
	}, [defaultCoin]);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					ref={triggerRef}
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full justify-between capitalize hover:border-white dark:bg-mybackground-dark hover:dark:bg-slate-700'>
					{value || 'Select a Coin'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50 fill-white' />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='p-0'
				style={{ width: triggerRef.current?.offsetWidth }}>
				<Command className='dark:bg-mybackground-dark'>
					<CommandInput placeholder='Search Coins...' />
					<CommandList>
						<CommandEmpty>No Coins found.</CommandEmpty>
						<CommandGroup>
							{coinList.map((chainKey, index) => {
								return (
									<CommandItem
										key={index}
										value={chainKey}
										onSelect={(currentValue) => {
											setValue(currentValue as coinTypes);
											setOpen(false);
										}}>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												value === chainKey ? 'opacity-100' : 'opacity-0'
											)}
										/>
										{chainKey}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default DropdownMenu;
