// 'use client';
// import {
// 	Dispatch,
// 	FC,
// 	forwardRef,
// 	SetStateAction,
// 	useEffect,
// 	useState,
// } from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useFieldArray, useForm } from 'react-hook-form';
// import { z } from 'zod';
// import {
// 	Form,
// 	FormControl,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from '@/components/ui/form';
// import { FaCheckCircle } from 'react-icons/fa';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import words from 'bip39';

// interface SecretPharseInputFormProps {
// 	closeModal: () => void;
// 	nextStep: (secret: string) => void;
// }

// const getFormSchema = () =>
// 	z.object({
// 		mnemonic: z
// 			.array(
// 				z
// 					.string()
// 					.min(1, 'Each word must have at least 1 character')
// 					.transform((value) => value.toLowerCase())
// 			)
// 			.length(12, 'You must enter exactly 12 words')
// 			.transform((values) => values.join(' '))
// 			.refine((value) => words.validateMnemonic(value), {
// 				message: 'Invalid Secret Phrase',
// 			}),
// 	});
// type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

// const SecretPharseInputForm = forwardRef<
// 	HTMLButtonElement,
// 	SecretPharseInputFormProps
// >(({ closeModal, nextStep }, ref) => {
// 	const form = useForm<FormSchema>({
// 		resolver: zodResolver(getFormSchema()),
// 	});
// 	const { fields } = useFieldArray({
// 		name: 'mnemonic',
// 		control: form.control,
// 	});

// 	function onSubmit(values: FormSchema) {
// 		closeModal();
// 		nextStep(values.mnemonic);
// 	}

// 	return (
// 		<Form {...form}>
// 			<form
// 				onSubmit={form.handleSubmit(onSubmit)}
// 				className='space-y-8'>
// 				<div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
// 					{fields.map((field, index) => (
// 						<FormField
// 							key={field.id}
// 							control={form.control}
// 							name={`mnemonic`}
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel className='text-white'>Word {index + 1}</FormLabel>
// 									<FormControl>
// 										<Input
// 											placeholder={`Word ${index + 1}`}
// 											autoComplete='off'
// 											{...field}
// 											className={`w-full dark:bg-mybackground-dark dark:text-white `}
// 										/>
// 									</FormControl>
// 									<FormMessage className='text-red-600 text-[14px]' />
// 								</FormItem>
// 							)}
// 						/>
// 					))}
// 				</div>

// 				<Button
// 					type='submit'
// 					ref={ref}
// 					className='hidden'>
// 					Submit
// 				</Button>
// 			</form>
// 		</Form>
// 	);
// });

// SecretPharseInputForm.displayName = 'SecretPharseInputForm';
// export default SecretPharseInputForm;
