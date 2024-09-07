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
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateMnemonic } from 'bip39';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';

interface SecretPharseInputFormProps {
	closeModal: () => void;
	nextStep: (secret: string) => void;
}
const validateMnemonicCustom = (mnemonic: string) => {
	return validateMnemonic(mnemonic) ? null : 'Invalid Secret Phrase';
};
const getFormSchema = () =>
	z.object({
		mnemonic: z
			.array(
				z.object({
					word: z
						.string()
						.min(1, 'Each word must have at least 1 character')
						.transform((value) => value.toLowerCase()),
				})
			)
			.length(12, 'You must enter exactly 12 words'),
	});
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

const SecretPharseInputForm = forwardRef<
	HTMLButtonElement,
	SecretPharseInputFormProps
>(({ closeModal, nextStep }, ref) => {
	const form = useForm<FormSchema>({
		resolver: zodResolver(getFormSchema()),
		defaultValues: {
			mnemonic: Array.from({ length: 12 }).map(() => ({ word: '' })),
		},
		shouldUnregister: true,
	});

	const [customError, setCustomError] = useState<string | null>(null);
	const { fields } = useFieldArray({
		control: form.control,
		name: 'mnemonic',
	});

	function onSubmit(values: FormSchema) {
		const mnemonic = values.mnemonic.map((obj) => obj.word).join(' ');
		const error = validateMnemonicCustom(mnemonic);

		if (error) {
			setCustomError(error);
		} else {
			setCustomError(null);
			closeModal();
			nextStep(mnemonic);
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8'>
				<div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
					{fields.map((field, index) => (
						<FormField
							key={field.id}
							control={form.control}
							name={`mnemonic.${index}.word`}
							render={({ field }) => (
								<FormItem>
									{/* <FormLabel className='text-white'>Word {index + 1}</FormLabel> */}
									<FormControl>
										<Input
											placeholder={`Word ${index + 1}`}
											autoComplete='off'
											{...form.register(`mnemonic.${index}.word`)}
											className={`w-full dark:bg-mybackground-dark dark:text-white ${
												form.formState.errors.mnemonic?.[index]
													? 'border-red-500'
													: ''
											}`}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					))}
				</div>
				{customError && (
					<div className='text-red-600 text-sm mt-4 text-center'>
						{customError}
					</div>
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
});

SecretPharseInputForm.displayName = 'SecretPharseInputForm';
export default SecretPharseInputForm;
