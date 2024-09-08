'use client';
import { forwardRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TriangleAlertIcon } from 'lucide-react';

interface LoginFormProps {
	closeModal: () => void;
	nextStep: (password: string) => void;
	errorMessage: string | null;
	handleForgotPassword?: () => void;
	type?: 'default' | 'check' | 'reauth';
}

const getFormSchema = () =>
	z.object({
		password: z.string(),
	});

type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

const LoginForm = forwardRef<HTMLButtonElement, LoginFormProps>(
	(
		{
			closeModal,
			nextStep,
			errorMessage,
			handleForgotPassword,
			type = 'default',
		},
		ref
	) => {
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

								{type === 'check' && (
									<div className='flex flex-col gap-5'>
										<h1 className='text-center'>
											On the next Page you will receive your secret
										</h1>
										<div className='flex flex-col text-red-500 gap-5 items-center font-semibold max-w-[500px] mx-auto'>
											<div className='grid grid-cols-9 space-x-5 bg-slate-900 rounded-md p-5'>
												<TriangleAlertIcon
													size={25}
													className='col-span-1'
												/>
												<p className='col-span-8'>{`Your private key/secrets gives full access to your wallet. Keep it secure to prevent unauthorized access to your funds.`}</p>
											</div>
											<div className='grid grid-cols-9 space-x-5 bg-slate-900  rounded-md p-5 '>
												<TriangleAlertIcon
													size={25}
													className='col-span-1'
												/>
												<p className='col-span-8'>{` Do not enter your private key/secrets on untrusted apps or websites. Always keep it private and safe.`}</p>
											</div>
										</div>
									</div>
								)}
								<FormControl>
									<div>
										<Input
											placeholder='Enter Password'
											autoComplete='off'
											{...field}
											className=''
											containerClass={`${
												type === 'check' ? '' : 'lg:w-1/2 '
											} w-full max-w-[500px] mx-auto mt-10 `}
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
					{type === 'default' && handleForgotPassword && (
						<p
							className='text-center text-sm cursor-pointer hover:underline hover:text-purple-500 w-fit mx-auto'
							onClick={() => {
								handleForgotPassword();
								closeModal();
							}}>
							forgot your password
						</p>
					)}

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
