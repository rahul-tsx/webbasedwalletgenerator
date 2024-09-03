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
		if (!isAuthenticated) {
			router.push('/');
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		changeStatus('Not Logged In', 'error');
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
