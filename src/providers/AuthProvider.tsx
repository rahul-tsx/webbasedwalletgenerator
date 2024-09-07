'use client';
import React, { useContext, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import StatusContext from '@/context/statusContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated } = useAuthStore();
	const router = useRouter();
	const context = useContext(StatusContext);
	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;

	useEffect(() => {
		const isLoggingOut = sessionStorage.getItem('isLoggingOut');

		if (!isAuthenticated && !isLoggingOut) {
			changeStatus('Permission Denied,Please log in!', 'error');
			router.push('/');
		}

		if (isLoggingOut) {
			sessionStorage.removeItem('isLoggingOut');
		}
	}, [isAuthenticated, router, changeStatus]);

	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
