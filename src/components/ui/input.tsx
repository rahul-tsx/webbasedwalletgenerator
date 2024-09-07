import * as React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	isPassword?: boolean;
	containerClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, isPassword, containerClass, ...props }, ref) => {
		const [visiblePassword, setVisiblePassword] = React.useState(false);
		const togglePassword = () => setVisiblePassword(!visiblePassword);

		return (
			<div className={cn('relative ', containerClass)}>
				<input
					type={isPassword ? (!visiblePassword ? 'password' : 'text') : type}
					className={cn(
						'flex w-full rounded-[6px] border border-input dark:bg-mybackground-light dark:text-mybackground-dark text-mybackground-light bg-mybackground-dark px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
						className
					)}
					ref={ref}
					{...props}
				/>
				{isPassword && (
					<button
						type='button'
						onClick={togglePassword}
						className='absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none text-black'>
						{visiblePassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
					</button>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';

export { Input };
