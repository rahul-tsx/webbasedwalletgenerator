'use client';
import { useAuthStore } from '@/store/auth';
import { FC, useEffect } from 'react';

interface AuthHandlerProps {}

const AuthHandler: FC<AuthHandlerProps> = ({}) => {
	const { setAuthStatus } = useAuthStore();

	useEffect(() => {
		const isAuth = sessionStorage.getItem('isAuth') === 'true';
		console.log(isAuth);
		setAuthStatus(isAuth);
	}, [setAuthStatus]);
	return <></>;
};

export default AuthHandler;
