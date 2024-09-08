'use client';
import Link from 'next/link';
import { FC, useContext } from 'react';
import { Button } from './ui/button';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import StatusContext from '@/context/statusContext';

interface NavbarProps {
	type?: 'auth' | 'default';
}

const Navbar: FC<NavbarProps> = ({ type = 'default' }) => {
	const { isAuthenticated, localPassword, setAuthStatus } = useAuthStore();
	const navItems = isAuthenticated && localPassword;
	const router = useRouter();
	const context = useContext(StatusContext);
	if (!context) {
		throw new Error('useContext must be used within a Provider');
	}

	const { changeStatus } = context;
	const handleLogout = () => {
		sessionStorage.setItem('isLoggingOut', 'true');
		router.push('/');
		sessionStorage.removeItem('isAuth');
		changeStatus('Logged Out Successfully!', 'success');
	};
	return (
		<header className=' w-full'>
			<nav className='flex my-5 items-center justify-between '>
				<Link
					href={'/'}
					className='dark:text-neonYellow text-mybackground-dark text-2xl font-bold cursor-pointer'>
					VaultChain
				</Link>
				{type === 'auth' && <Button onClick={handleLogout}>Logout</Button>}
			</nav>
		</header>
	);
};

export default Navbar;
