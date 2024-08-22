'use client';
import {
	Dispatch,
	FC,
	forwardRef,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import SolIcon from '@/assets/images/solana-sol-logo.png';
import EthIcon from '@/assets/images/Ethereum-logo.png';

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
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { coinUnit } from '@/constants/coinUnit';
import Image from 'next/image';
import { checkNetworkFees } from '@/utils/solanaValidation';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface SendTokenFormProps {
	maxAmount: number;
	coinType: coinTypes;
	receiverPubKey: string;
	setAmountToSend: Dispatch<SetStateAction<number>>;
	sendToken: (amount: number) => void;
	senderPubKey: string;
}

const SendTokenForm = forwardRef<HTMLButtonElement, SendTokenFormProps>(
	(
		{
			maxAmount,
			coinType,
			receiverPubKey,
			setAmountToSend,
			sendToken,
			senderPubKey,
		},
		ref
	) => {
		const [maxSol, setMaxSol] = useState(maxAmount);

		const getFinalTokenBalance = (maxAmount: number, fees: number) => {
			const totalLamports = maxAmount * LAMPORTS_PER_SOL;
			const finalLamports = totalLamports - fees;
			const finalSolBalance = finalLamports / LAMPORTS_PER_SOL;
			setMaxSol(finalSolBalance > 0 ? finalSolBalance : 0);
		};

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
				.refine((value) => value <= maxSol, {
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
			const fetchNetworkFees = async () => {
				const fees = await checkNetworkFees(senderPubKey, receiverPubKey);
				getFinalTokenBalance(maxAmount, fees ?? 0);
			};
			fetchNetworkFees();
		}, [senderPubKey, receiverPubKey, maxAmount]);

		useEffect(() => {
			if (amount > maxSol) {
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
		}, [amount, maxSol, setError, clearErrors]);

		function onSubmit(values: FormSchema) {
			setAmountToSend(values.amount);
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
								<FormDescription className='text-xl text-white text-center py-5 flex  items-center space-x-3 justify-center'>
									<Image
										alt='coinLogo'
										src={
											coinType === 'solana'
												? SolIcon
												: coinType === 'ethereum'
												? EthIcon
												: ''
										}
										className='size-12 p-2 aspect-square rounded-full  bg-black'
									/>
									<span className='text-3xl uppercase'>
										{' '}
										{`${coinUnit[coinType]}`}
									</span>
								</FormDescription>
								<FormDescription className='text-xl text-white text-center py-5'>
									{`Max: ${maxSol.toFixed(6)} ${coinUnit[coinType]}`}
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
	}
);
SendTokenForm.displayName = 'SendTokenForm';
export default SendTokenForm;
