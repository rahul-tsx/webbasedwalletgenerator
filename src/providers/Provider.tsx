'use client';
import { FC, useEffect, useState } from 'react';
import { ModalProvider } from '@/components/ui/animated-modal';
import StatusContext from '@/context/statusContext';
import { toast } from 'sonner';
import { CgClose } from 'react-icons/cg';
interface ProviderProps {
	children: React.ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
	const [status, setStatus] = useState<string | null>(null);
	const changeStatus = (message: string) => {
		setStatus(message);
	};
	useEffect(() => {
		if (status) {
			toast(status, {
				action: {
					label: <CgClose size={10} />,
					onClick: () => {},
				},
			});

			const timeout = setTimeout(() => {
				setStatus(null);
			}, 2000);

			return () => clearTimeout(timeout);
		}
	}, [status, setStatus]);
	return (
		<>
			<StatusContext.Provider value={{ status, changeStatus }}>
				<ModalProvider>{children}</ModalProvider>
			</StatusContext.Provider>
		</>
	);
};

export default Provider;
