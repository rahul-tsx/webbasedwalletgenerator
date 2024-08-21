'use client';
import { Dispatch, FC, forwardRef, SetStateAction } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { coinUnit } from '@/constants/coinUnit';

interface AddReceiverFormProps {
	coinType: coinTypes;
	setReceiverPubKey: Dispatch<SetStateAction<string | null>>;
	closeModal: () => void;
	nextStep: () => void;
	senderPubKey: string;
}
const getFormSchema = (senderPubKey: string) =>
	z.object({
		receiverPubKey: z
			.string()
			.min(1, 'Please enter receiver address')
			.length(44, {
				message: 'Invalid public key',
			})
			.refine((value) => value !== senderPubKey, {
				message:
					'Receiver public key cannot be the same as the sender public key',
			}),
	});

type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

const AddReceiverForm = forwardRef<HTMLButtonElement, AddReceiverFormProps>(
	(
		{ coinType, setReceiverPubKey, closeModal, nextStep, senderPubKey },
		ref
	) => {
		const form = useForm<FormSchema>({
			resolver: zodResolver(getFormSchema(senderPubKey)),
		});

		function onSubmit(values: FormSchema) {
			setReceiverPubKey(values.receiverPubKey);
			closeModal();
			nextStep();
			console.log('hello');
		}
		return (
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8'>
					<FormField
						control={form.control}
						name='receiverPubKey'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-white'>Receiver Address</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter Receiver Address'
										autoComplete='off'
										{...field}
										className='w-full '
									/>
								</FormControl>
								<FormMessage className='text-red-600 text-[16px] mx-5 font-semibold'/>
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

export default AddReceiverForm;
