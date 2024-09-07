import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/providers/AuthProvider';
import { FC, ReactNode } from 'react';

interface walletLayoutProps {
	children: ReactNode;
}

const walletLayout: FC<walletLayoutProps> = ({ children }) => {
	return (
		<ProtectedRoute>
			<div className='myContainer'>
				<Navbar type='auth'/>
			</div>

			{children}
		</ProtectedRoute>
	);
};

export default walletLayout;
