'use client';
import { Dispatch, FC, forwardRef, SetStateAction } from 'react';

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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MintTokenFormProps {
	closeModal: () => void;
	nextStep: (
		amount: number,
		tokenName: string,
		tokenSymbol: string,
		metadataURI: string,
		decimals: number
	) => void;
}

const getFormSchema = () =>
	z.object({
		tokenName: z.string().min(1, 'Please enter token name'),
		tokenSymbol: z.string().min(1, 'Please enter token symbol'),
		decimals: z
			.union([z.string(), z.number()])
			.transform((value) => {
				if (typeof value === 'string') {
					return parseFloat(value);
				}
				return value;
			})
			.refine((value) => !isNaN(value), {
				message: 'Must be a valid number',
			})
			.refine((value) => value >= 0, {
				message: 'Decimal must be greater than or equal to zero',
			})
			.refine((value) => value < 10, {
				message: 'Decimal must be less than 10',
			}),
		metadataURI: z
			.string()
			.url('Must be a valid URL')
			.refine((url) => url.startsWith('https://'), {
				message: 'URL must start with https://',
			}),
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
			}),
	});

type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

const MintTokenForm = forwardRef<HTMLButtonElement, MintTokenFormProps>(
	({ closeModal, nextStep }, ref) => {
		const form = useForm<FormSchema>({
			resolver: zodResolver(getFormSchema()),
			defaultValues: { decimals: 9 },
		});

		function onSubmit(values: FormSchema) {
			nextStep(
				values.amount,
				values.tokenName,
				values.tokenSymbol,
				values.metadataURI,
				values.decimals
			);
			console.log('hello');
		}
		return (
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 '>
					<FormField
						control={form.control}
						name='tokenName'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-white'>Token Name</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter Token Name'
										autoComplete='off'
										{...field}
										className='w-full '
									/>
								</FormControl>
								<FormMessage className='text-red-600 text-[16px] mx-5 font-semibold' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='tokenSymbol'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-white'>Token Symbol</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter Token Symbol'
										autoComplete='off'
										{...field}
										className='w-full '
									/>
								</FormControl>
								<FormMessage className='text-red-600 text-[16px] mx-5 font-semibold' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='decimals'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-white'>Decimals</FormLabel>
								<FormControl>
									<Input
										type='range'
										min={0}
										max={9}
										defaultValue={9}
										{...field}
										className='w-full '
									/>
								</FormControl>
								<span className='text-white'>{field.value || '9'}</span>
								<FormDescription>
									Token decimals for precision in token values.
								</FormDescription>
								<FormMessage className='text-red-600 text-[16px] mx-5 font-semibold' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='metadataURI'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-white'>Metadata file link</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter file URL'
										autoComplete='off'
										{...field}
										className='w-full '
									/>
								</FormControl>
								<FormDescription>
									{`The URL to your token's metadata JSON file.`}
								</FormDescription>
								<FormMessage className='text-red-600 text-[16px] mx-5 font-semibold' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='amount'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-white'>Mint Amount</FormLabel>
								<FormControl>
									<Input
										placeholder='Mint Amount'
										autoComplete='off'
										{...field}
										className='w-full '
									/>
								</FormControl>
								<FormDescription>
									The total number of tokens to be minted.
								</FormDescription>
								<FormMessage className='text-red-600 text-[16px] mx-5 font-semibold' />
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
MintTokenForm.displayName = 'MintTokenForm';
export default MintTokenForm;
