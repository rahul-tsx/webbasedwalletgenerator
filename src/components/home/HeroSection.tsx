'use client';
import { motion } from 'framer-motion';
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { FC } from 'react';
import Cta from './Cta';
import { Modal } from '../ui/animated-modal';

interface HeroSectionProps {}

const HeroSection: FC<HeroSectionProps> = ({}) => {
	return (
		<HeroHighlight
			containerClassName='h-screen'
			className='myContainer'>
			<motion.h1
				initial={{
					opacity: 0,
					y: 20,
				}}
				animate={{
					opacity: 1,
					y: [20, -5, 0],
				}}
				transition={{
					duration: 0.5,
					ease: [0.4, 0.0, 0.2, 1],
				}}
				className='text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-mybackground-dark dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto '>
				{`Secure Your Digital Assets with `}
				<Highlight
					className='text-slate-950 bg-gradient-to-r from-neonYellow to-neonBlue dark:from-neonYellow dark:to-neonGreen
'>
					VaultChain
				</Highlight>
			</motion.h1>
			<motion.h3
				initial={{
					opacity: 0,
					y: 20,
				}}
				animate={{
					opacity: 1,
					y: [20, -5, 0],
				}}
				transition={{
					delay: 2,
					duration: 0.5,
					ease: [0.4, 0.0, 0.2, 1],
				}}
				className='text-lg px-4 md:text-4xl lg:text-2xl font-bold text-mybackground-dark dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto my-10'>
				{`Manage your wallets effortlessly, create unique tokens, and transfer assets with top-notch security and ease`}
			</motion.h3>
			<Modal>
				<Cta />
			</Modal>
		</HeroHighlight>
	);
};

export default HeroSection;
