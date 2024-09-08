'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const NotFoundPage = () => {
	const router = useRouter();

	useEffect(() => {
		document.title = 'Page Not Found - VaultChain';
	}, []);

	const handleRedirect = () => {
		router.push('/');
	};

	return (
		<div className='flex items-center justify-center h-screen bg-gray-900 text-white'>
			<div className='text-center'>
				<h1 className='text-5xl font-bold'>404</h1>
				<p className='mt-4 text-lg'>
					{`Oops! The page you're looking for doesn't exist.`}
				</p>
				<button
					onClick={handleRedirect}
					className='mt-6 px-6 py-3 bg-teal-500 text-black font-semibold rounded hover:bg-teal-600'>
					Go Back to Home
				</button>
			</div>
		</div>
	);
};

export default NotFoundPage;
