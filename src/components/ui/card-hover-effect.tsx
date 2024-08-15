import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { BiCopy } from 'react-icons/bi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const HoverEffect = ({
	items,
	setStatus,
	className,
}: {
	items: Wallet[];
	className?: string;
	setStatus: Dispatch<SetStateAction<string | null>>;
}) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [visiblePrivateKeyIndex, setVisiblePrivateKeyIndex] = useState<
		number | null
	>(null);

	const togglePrivateKeyVisibility = (index: number) => {
		setVisiblePrivateKeyIndex(visiblePrivateKeyIndex === index ? null : index);
	};

	return (
		<div className={cn('col-span-7 my-10 ', className)}>
			{items.map((item, idx) => (
				<Link
					href={`#wallet-${idx + 1}`}
					key={item.publicKey}
					className='relative group block p-2 h-fit w-full'
					onMouseEnter={() => setHoveredIndex(idx)}
					onMouseLeave={() => setHoveredIndex(null)}>
					<AnimatePresence>
						{hoveredIndex === idx && (
							<motion.span
								className='absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl'
								layoutId='hoverBackground'
								initial={{ opacity: 0 }}
								animate={{
									opacity: 1,
									transition: { duration: 0.15 },
								}}
								exit={{
									opacity: 0,
									transition: { duration: 0.15, delay: 0.2 },
								}}
							/>
						)}
					</AnimatePresence>
					<Card>
						<CardTitle>
							Wallet {idx + 1}: {item.name}
						</CardTitle>
						<CardDescription className=' flex flex-col gap-3'>
							<p className='flex flex-col items-start'>
								<div className='flex  w-full justify-between'>
									<label className='text-xl font-bold text-white'>
										Public Key:
									</label>
									<div>
										<CopyToClipboard
											text={item.publicKey}
											onCopy={() =>
												setStatus('Public Key Copied to Clipboard!')
											}>
											<BiCopy className='cursor-pointer size-6' />
										</CopyToClipboard>
									</div>
								</div>

								<div>
									<span className='key-wrap'>{item.publicKey}</span>
								</div>
							</p>

							<div className='flex flex-col mt-2'>
								<div className='flex  w-full justify-between'>
									<label className='text-xl font-bold text-white'>
										Private Key:
									</label>
									<div>
										<CopyToClipboard
											text={item.privateKey}
											onCopy={() =>
												setStatus('Private Key Copied to Clipboard!')
											}>
											<BiCopy className='cursor-pointer size-6' />
										</CopyToClipboard>
									</div>
								</div>
								<div className='flex justify-between items-center'>
									<p className='key-wrap mr-2'>
										{visiblePrivateKeyIndex === idx
											? item.privateKey
											: '*'.repeat(50)}
									</p>

									<button
										onClick={() => togglePrivateKeyVisibility(idx)}
										className='focus:outline-none'>
										{visiblePrivateKeyIndex === idx ? (
											<FaEyeSlash size={20} />
										) : (
											<FaEye size={20} />
										)}
									</button>
								</div>
							</div>

							{item.coinType && (
								<p>
									Coin Type: <span>{item.coinType}</span>
								</p>
							)}
						</CardDescription>
					</Card>
				</Link>
			))}
		</div>
	);
};

export const Card = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				'rounded-2xl h-fit w-full p-4 overflow-hidden bg-slate-950 border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20',
				className
			)}>
			<div className='relative z-50'>
				<div className='p-4'>{children}</div>
			</div>
		</div>
	);
};

export const CardTitle = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<h4 className={cn('text-zinc-100 font-bold tracking-wide mt-4', className)}>
			{children}
		</h4>
	);
};

export const CardDescription = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				'mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm ',
				className
			)}>
			{children}
		</div>
	);
};
