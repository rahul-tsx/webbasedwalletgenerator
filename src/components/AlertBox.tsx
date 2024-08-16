import { FC } from 'react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface AlertBoxProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	title: string;
	description: string;
	onConfirm: () => void;
	onCancel?: () => void;
}

const AlertBox: FC<AlertBoxProps> = ({
	open,
	title,
	description,
	setOpen,
	onConfirm,
	onCancel,
}) => {
	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		}
		setOpen(false);
	};

	const handleConfirm = () => {
		onConfirm();
		setOpen(false);
	};
	return (
		<AlertDialog
			open={open}
			onOpenChange={setOpen}>
			<AlertDialogContent className='bg-slate-800'>
				<AlertDialogHeader>
					<AlertDialogTitle className='font-bold'>{title}</AlertDialogTitle>
					<AlertDialogDescription className='text-red-500 font-semibold'>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button
							variant='outline'
							className='bg-white text-black'
							onClick={handleCancel}>
							Cancel
						</Button>
					</AlertDialogCancel>

					<Button
						variant='destructive'
						onClick={handleConfirm}>
						Continue
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default AlertBox;
