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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { FaCheckCircle } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LoginFormProps {
	closeModal: () => void;
	nextStep: (password: string) => void;
	errorMessage: string | null;
}

const getFormSchema = () =>
	z.object({
		password: z.string(),
	});

type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

const LoginForm = forwardRef<HTMLButtonElement, LoginFormProps>(
	({ closeModal, nextStep, errorMessage }, ref) => {
		const form = useForm<FormSchema>({
			resolver: zodResolver(getFormSchema()),
		});

		function onSubmit(values: FormSchema) {
			nextStep(values.password);
		}

		return (
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8'>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<div className='text-white text-2xl text-center'>
									Enter your Password
								</div>
								<FormControl>
									<div>
										<Input
											placeholder='Enter Password'
											autoComplete='off'
											{...field}
											className=''
											containerClass='lg:w-1/2 w-full mx-auto mt-10'
											isPassword
										/>
									</div>
								</FormControl>
								<p className='text-red-500 text-lg text-center'>
									{errorMessage}
								</p>
							</FormItem>
						)}
					/>
					<p className='text-center text-sm cursor-pointer hover:underline hover:text-purple-500'>
						forgot your password
					</p>

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

LoginForm.displayName = 'LoginForm';
export default LoginForm;
