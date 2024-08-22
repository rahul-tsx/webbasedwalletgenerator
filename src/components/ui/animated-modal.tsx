'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	forwardRef,
} from 'react';

interface ModalContextType {
	modals: { [key: string]: boolean };
	openModal: (id: string) => void;
	closeModal: (id: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [modals, setModals] = useState<{ [key: string]: boolean }>({});

	const openModal = (id: string) => {
		setModals((prev) => ({ ...prev, [id]: true }));
	};

	const closeModal = (id: string) => {
		setModals((prev) => ({ ...prev, [id]: false }));
	};

	return (
		<ModalContext.Provider value={{ modals, openModal, closeModal }}>
			{children}
		</ModalContext.Provider>
	);
};

export const useModal = (id: string) => {
	const context = useContext(ModalContext);

	if (!context) {
		throw new Error('useModal must be used within a ModalProvider');
	}

	const { modals, openModal, closeModal } = context;

	const isOpen = modals[id] || false;

	return {
		isOpen,
		openModal: () => openModal(id),
		closeModal: () => closeModal(id),
	};
};

export function Modal({ children }: { children: ReactNode }) {
	return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = forwardRef<
	HTMLButtonElement,
	{ children: ReactNode; className?: string; modalId: string }
>(({ children, className, modalId }, ref) => {
	const { openModal } = useModal(modalId);

	return (
		<button
			ref={ref}
			className={cn(
				'px-4 py-2 rounded-md text-black dark:text-white text-center relative overflow-hidden',
				className
			)}
			onClick={() => openModal()}>
			{children}
		</button>
	);
});
ModalTrigger.displayName = 'ModalTrigger';

export const ModalBody = ({
	children,
	className,
	modalId,
}: {
	children: ReactNode;
	className?: string;
	modalId: string;
}) => {
	const { isOpen, closeModal } = useModal(modalId);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}, [isOpen]);

	const modalRef = useRef(null);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
						backdropFilter: 'blur(10px)',
					}}
					exit={{
						opacity: 0,
						backdropFilter: 'blur(0px)',
					}}
					className='fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50'>
					<Overlay />

					<motion.div
						ref={modalRef}
						className={cn(
							'min-h-[50%] max-h-[90%] w-full md:max-w-[60%] 2xl:max-w-[40%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden overflow-y-auto ',
							className
						)}
						initial={{
							opacity: 0,
							scale: 0.5,
							rotateX: 40,
							y: 40,
						}}
						animate={{
							opacity: 1,
							scale: 1,
							rotateX: 0,
							y: 0,
						}}
						exit={{
							opacity: 0,
							scale: 0.8,
							rotateX: 10,
						}}
						transition={{
							type: 'spring',
							stiffness: 260,
							damping: 15,
						}}>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export const ModalContent = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn('flex flex-col flex-1 p-8 md:p-10', className)}>
			{children}
		</div>
	);
};

export const ModalFooter = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn('flex justify-end p-4 bg-gray-100 ', className)}>
			{children}
		</div>
	);
};

const Overlay = ({ className }: { className?: string }) => {
	return (
		<motion.div
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
				backdropFilter: 'blur(10px)',
			}}
			exit={{
				opacity: 0,
				backdropFilter: 'blur(0px)',
			}}
			className={`fixed inset-0 h-full w-full bg-mybackground-dark bg-opacity-50 z-50 ${className}`}></motion.div>
	);
};

// const CloseIcon = () => {
// 	const { setOpen } = useModal();
// 	return (
// 		<button
// 			onClick={() => setOpen(false)}
// 			className='absolute top-4 right-4 group'>
// 			<svg
// 				xmlns='http://www.w3.org/2000/svg'
// 				width='24'
// 				height='24'
// 				viewBox='0 0 24 24'
// 				fill='none'
// 				stroke='currentColor'
// 				strokeWidth='2'
// 				strokeLinecap='round'
// 				strokeLinejoin='round'
// 				className='text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200'>
// 				<path
// 					stroke='none'
// 					d='M0 0h24v24H0z'
// 					fill='none'
// 				/>
// 				<path d='M18 6l-12 12' />
// 				<path d='M6 6l12 12' />
// 			</svg>
// 		</button>
// 	);
// };

// Hook to detect clicks outside of a component.
// Add it in a separate file, I've added here for simplicity
// export const useOutsideClick = (
// 	ref: React.RefObject<HTMLDivElement>,
// 	callback: Function
// ) => {
// 	useEffect(() => {
// 		const listener = (event: any) => {
// 			// DO NOTHING if the element being clicked is the target element or their children
// 			if (!ref.current || ref.current.contains(event.target)) {
// 				return;
// 			}
// 			callback(event);
// 		};

// 		document.addEventListener('mousedown', listener);
// 		document.addEventListener('touchstart', listener);

// 		return () => {
// 			document.removeEventListener('mousedown', listener);
// 			document.removeEventListener('touchstart', listener);
// 		};
// 	}, [ref, callback]);
// };
