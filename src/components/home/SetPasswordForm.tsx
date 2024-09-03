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

interface SetPasswordFormProps {
	closeModal: () => void;
	nextStep: (password: string) => void;
}

const passwordSchema = z
	.string()
	.regex(/^\S*$/, 'Password must not contain spaces');

const getFormSchema = () =>
	z
		.object({
			password: passwordSchema,
			confirmPassword: z.string(),
		})
		.refine((value) => value.password === value.confirmPassword, {
			message: 'Passwords must match',
			path: ['confirmPassword'],
		});

type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

const SetPasswordForm = forwardRef<HTMLButtonElement, SetPasswordFormProps>(
	({ closeModal, nextStep }, ref) => {
		const form = useForm<FormSchema>({
			resolver: zodResolver(getFormSchema()),
		});

		const [isLengthValid, setIsLengthValid] = useState(false);
		const [hasUpperCase, setHasUpperCase] = useState(false);
		const [hasNumber, setHasNumber] = useState(false);
		const [hasSpecialChar, setHasSpecialChar] = useState(false);

		useEffect(() => {
			const password = form.watch('password') || '';
			setIsLengthValid(password.length >= 8);
			setHasUpperCase(/[A-Z]/.test(password));
			setHasNumber(/\d/.test(password));
			setHasSpecialChar(/[@$!%*?&#]/.test(password));
		}, [form.watch('password')]);

		function onSubmit(values: FormSchema) {
			closeModal();
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
								<div className='flex flex-col mx-20  p-2'>
									<p
										className={`flex items-center space-x-3 ${
											isLengthValid ? 'text-green-400' : 'text-gray-400'
										}`}>
										<FaCheckCircle
											className={
												isLengthValid ? 'text-green-400' : 'text-gray-400'
											}
										/>
										<span>Password must be at least 8 characters long.</span>
									</p>
									<p
										className={`flex items-center space-x-3 ${
											hasUpperCase ? 'text-green-400' : 'text-gray-400'
										}`}>
										<FaCheckCircle
											className={
												hasUpperCase ? 'text-green-400' : 'text-gray-400'
											}
										/>
										<span>
											Password must contain at least one uppercase letter.
										</span>
									</p>
									<p
										className={`flex items-center space-x-3 ${
											hasNumber ? 'text-green-400' : 'text-gray-400'
										}`}>
										<FaCheckCircle
											className={hasNumber ? 'text-green-400' : 'text-gray-400'}
										/>
										<span>Password must contain at least one number.</span>
									</p>
									<p
										className={`flex items-center space-x-3 ${
											hasSpecialChar ? 'text-green-400' : 'text-gray-400'
										}`}>
										<FaCheckCircle
											className={
												hasSpecialChar ? 'text-green-400' : 'text-gray-400'
											}
										/>
										<span>
											Password must contain at least one special character.
										</span>
									</p>
								</div>
								<FormLabel className='text-white'>Password</FormLabel>
								<FormControl>
									<div>
										<Input
											placeholder='Enter Password'
											autoComplete='off'
											{...field}
											className='w-full'
											isPassword
										/>
									</div>
								</FormControl>
								<FormMessage className='text-red-600 text-[16px] mx-5 font-semibold' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-white'>Confirm Password</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter Password Again'
										autoComplete='off'
										{...field}
										className='w-full'
										isPassword
									/>
								</FormControl>
								<FormMessage className='text-red-600 text-[16px] mx-5 font-semibold' />
							</FormItem>
						)}
					/>
					<div className='text-center text-xl'>
						Note: This is the local password for login into your wallet
					</div>
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

SetPasswordForm.displayName = 'SetPasswordForm';
export default SetPasswordForm;
