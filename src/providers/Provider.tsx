import { FC } from 'react';
import { ModalProvider } from '@/components/ui/animated-modal';

interface ProviderProps {
	children: React.ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
	return (
		<>
			<ModalProvider>{children}</ModalProvider>
		</>
	);
};

export default Provider;
