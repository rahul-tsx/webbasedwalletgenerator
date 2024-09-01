'use client';
import {
	Dispatch,
	FC,
	forwardRef,
	SetStateAction,
	useEffect,
	useState,
} from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import TooltipComponent from '@/components/TooltipComponent';

interface TransferMintedTokenFormProps {
	receiverPubKey: string;
	sendToken: (amount: number) => void;
	senderPubKey: string;
	token: TokenData;
}

const TransferMintedTokenForm = forwardRef<
	HTMLButtonElement,
	TransferMintedTokenFormProps
>(({ receiverPubKey, sendToken, token, senderPubKey }, ref) => {
	const [maxToken, setMaxToken] = useState(
		parseFloat(token.mintAddress.amount)
	);

	const formSchema = z.object({
		amount: z
			.string()
			.min(1, { message: 'Enter Amount' })
			.refine(
				(value) => {
					const parsed = parseFloat(value);
					return !isNaN(parsed);
				},
				{
					message: 'Must be a valid number',
				}
			)
			.transform((value) => parseFloat(value))
			.refine((value) => value > 0, {
				message: 'Amount must be greater than zero',
			})
			.refine((value) => value <= maxToken, {
				message: 'Insufficient balance',
			}),
	});
	type FormSchema = z.infer<typeof formSchema>;

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
	});

	const { watch, setError, clearErrors } = form;
	const amount = watch('amount');

	useEffect(() => {
		if (amount > maxToken) {
			setError('amount', {
				type: 'manual',
				message: 'Insufficient balance',
			});
		} else if (amount < 0) {
			setError('amount', {
				type: 'manual',
				message: 'Amount Cannot be negative',
			});
		} else {
			clearErrors('amount');
		}
	}, [amount, setError, clearErrors]);
	const maxAmountFormat = (num: number, decimals: number): string => {
		const multiplier = Math.pow(10, decimals);
		const roundedNumber = Math.round(num * multiplier) / multiplier;
		const formattedNumber = roundedNumber
			.toFixed(decimals)
			.replace(/\.?0+$/, '');

		return formattedNumber;
	};
	function onSubmit(values: FormSchema) {
		sendToken(values.amount);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name='amount'
					render={({ field }) => (
						<FormItem className='gap-0 flex flex-col'>
							<FormDescription className='text-sm text-white text-center py-5'>
								{`Transfer to: ${receiverPubKey} `}
							</FormDescription>
							<FormControl>
								<div className='flex w-full flex-col justify-center items-center'>
									<input
										type='number'
										step={0.000001}
										pattern='^[0-9]*[.,]?[0-9]*$'
										placeholder='0'
										autoComplete='off'
										{...field}
										className='dark:bg-transparent custom-number-input dark:text-white text-6xl border-none outline-none mx-auto text-center w-full'
									/>
								</div>
							</FormControl>
							<FormDescription
								className={`text-xl text-white text-center py-5 flex  items-center space-x-3 justify-center`}>
								{token.imageUrl && (
									<div className='size-10 rounded-full bg-slate-950 text-neonYellow'>
										<img
											alt='tokenImage'
											src={token.imageUrl}
											className='size-10'
											width={10}
											height={10}
										/>
									</div>
								)}
								{!token.imageUrl && (
									<div className='size-14 rounded-full bg-slate-950 text-neonYellow items-center flex justify-center font-bold cursor-default'>
										<span>UT</span>
									</div>
								)}
								<span className='text-lg'>
									{token.tokenMetadataInfo?.name ? (
										<TooltipComponent
											triggerValue={token.tokenMetadataInfo.name}
											fullValue={token.mintAddress.mint}
										/>
									) : (
										<TooltipComponent
											triggerValue={'Unknown Token'}
											fullValue={token.mintAddress.mint}
										/>
									)}
								</span>
							</FormDescription>
							<FormDescription className='text-xl text-white text-center py-5'>
								{`Max: ${maxAmountFormat(maxToken, 9)} ${
									token.tokenMetadataInfo?.symbol || ''
								}`}
							</FormDescription>
							<FormMessage className='text-center font-bold text-xl p-2 rounded-lg w-fit m-auto text-red-700' />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					ref={ref}
					className='hidden'>
					Submit
				</Button>
			</form>
		</Form>
	);
});
TransferMintedTokenForm.displayName = 'TransferMintedTokenForm';
export default TransferMintedTokenForm;
