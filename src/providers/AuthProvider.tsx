
'use client';
import React, { useContext, useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import StatusContext from '@/context/statusContext';
import { useRouter } from 'next/navigation';
import PermissionDeniedPage from '@/components/PermissionNotAllowed';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated, setAuthStatus } = useAuthStore();
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const context = useContext(StatusContext);

	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;

	useEffect(() => {
		const isLoggingOut = sessionStorage.getItem('isLoggingOut');
		if (isLoggingOut) {
			setAuthStatus(false);
			return;
		}
		const timer = setTimeout(() => {
			setLoading(false);
		}, 250);

		return () => {
			sessionStorage.removeItem('isLoggingOut');
			clearTimeout(timer);
		};
	}, []);

	if (loading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<p>Loading...</p>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <PermissionDeniedPage />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
