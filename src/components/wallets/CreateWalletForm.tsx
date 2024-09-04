'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { forwardRef } from 'react';

import { Button } from '@/components/ui/button';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CreateWalletFormProps {
	index: number;
	// defaultSecretPhrase: string;

	createWallet: ({
		// mnemonic,
		coinType,
		walletName,
	}: {
		// mnemonic: string;
		coinType: string;
		walletName: string;
	}) => void;
}

const formSchema = z.object({
	walletName: z.string().min(3, {
		message: 'Wallet name must be at least 3 characters.',
	}),
	// secretPhrase: z.string().refine(
	// 	(value) => {
	// 		return value.split(' ').length === 12;
	// 	},
	// 	{
	// 		message: 'Secret phrase must contain exactly 12 words.',
	// 	}
	// ),
	coinType: z.enum(['solana', 'ethereum', 'bitcoin'], {
		errorMap: () => ({
			message: 'Coin type must be one of: solana, ethereum, or bitcoin.',
		}),
	}),
});

const CreateWalletForm = forwardRef<HTMLButtonElement, CreateWalletFormProps>(
	({ createWallet,
		//  defaultSecretPhrase, 
		 index }, ref) => {
		const form = useForm<z.infer<typeof formSchema>>({
			resolver: zodResolver(formSchema),
			defaultValues: {
				walletName: '',
				// secretPhrase: defaultSecretPhrase,
				coinType: 'solana',
			},
		});

		function onSubmit(values: z.infer<typeof formSchema>) {
			// Do something with the form values.
			createWallet({
				// mnemonic: values.secretPhrase,
				coinType: values.coinType,
				walletName: values.walletName,
			});
		}

		return (
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8'>
					<FormField
						control={form.control}
						name='walletName'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-white'>Wallet Name</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter wallet name'
										autoComplete='off'
										{...field}
										className='w-full'
									/>
								</FormControl>
								{
									<FormDescription>
										This is the name for your wallet.
									</FormDescription>
								}
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* <FormField
						control={form.control}
						name='secretPhrase'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-white'>Secret Phrase</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter secret phrase'
										autoComplete='off'
										{...field}
										className='w-full'
									/>
								</FormControl>
								<FormDescription>
									Enter your 12-word mnemonic phrase.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/> */}
					<FormField
						control={form.control}
						name='coinType'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Coin Type</FormLabel>
								<FormControl>
									<RadioGroup
										value={field.value}
										onValueChange={field.onChange}
										className='flex space-x-5'>
										<FormItem>
											<FormLabel>
												<RadioGroupItem value='solana' /> Solana
											</FormLabel>
										</FormItem>
										<FormItem>
											<FormLabel>
												<RadioGroupItem value='ethereum' /> Ethereum
											</FormLabel>
										</FormItem>
										{/* <FormItem>
											<FormLabel>
												<RadioGroupItem value='bitcoin' /> Bitcoin
											</FormLabel>
										</FormItem> */}
									</RadioGroup>
								</FormControl>
								<FormMessage />
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

CreateWalletForm.displayName = 'CreateWalletForm'; // Set display name for better debugging

export default CreateWalletForm;
