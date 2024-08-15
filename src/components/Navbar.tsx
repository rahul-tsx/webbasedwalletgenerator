import { FC } from 'react';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
	return (
		<header className='bg-mybackground-dark '>
			<nav className='flex my-5 items-center justify-between myContainer'>
				<h1 className='text-neonYellow text-[48px] font-bold'>VaultChain</h1>
			</nav>
		</header>
	);
};

export default Navbar;
