'use client';

import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
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

interface DropdownProps {
	dropdownValue: DropdownValue;
	defaultChain: SolanaChain | EthereumChain;
	value: SolanaChain | EthereumChain | null;
	setValue: Dispatch<SetStateAction<SolanaChain | EthereumChain | null>>;
}

const DropdownMenu: FC<DropdownProps> = ({
	dropdownValue,
	defaultChain,
	setValue,
	value,
}) => {
	const [open, setOpen] = useState(false);
	

	useEffect(() => {
		setValue(defaultChain);
	}, [defaultChain]);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-[200px] justify-between capitalize hover:border-white dark:bg-mybackground-dark hover:dark:bg-slate-700'>
					{value || 'Select a chain'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50 fill-white' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='max-w-[200px] p-0'>
				<Command className='dark:bg-mybackground-dark'>
					<CommandInput placeholder='Search Chains...' />
					<CommandList>
						<CommandEmpty>No chains found.</CommandEmpty>
						<CommandGroup>
							{Object.keys(dropdownValue).map((chainKey, index) => {
								return (
									<CommandItem
										key={index}
										value={chainKey}
										onSelect={(currentValue) => {
											setValue(currentValue as SolanaChain | EthereumChain);
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
