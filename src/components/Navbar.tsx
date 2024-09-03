import Link from 'next/link';
import { FC } from 'react';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
	return (
		<header className=' w-full'>
			<nav className='flex my-5 items-center justify-between '>
				<Link
					href={'/'}
					className='dark:text-neonYellow text-mybackground-dark text-2xl font-bold cursor-pointer'>
					VaultChain
				</Link>
			</nav>
		</header>
	);
};

export default Navbar;
