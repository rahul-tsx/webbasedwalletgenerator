'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Tab = {
	title: string;
	value: string;
	content?: string | React.ReactNode | any;
};

export const Tabs = ({
	tabs: propTabs,
	containerClassName,
	activeTabClassName,
	tabClassName,
	contentClassName,
	setSelectedTab,
}: {
	tabs: Tab[];
	containerClassName?: string;
	activeTabClassName?: string;
	tabClassName?: string;
	contentClassName?: string;
	setSelectedTab: Dispatch<SetStateAction<TabList>>;
}) => {
	const [active, setActive] = useState<Tab>(propTabs[0]);
	const [tabs, setTabs] = useState<Tab[]>(propTabs);

	const tabSelected = (tab: Tab) => {
		setActive(tab);
		setSelectedTab(tab.value as TabList);
	};

	const [hovering, setHovering] = useState(false);

	return (
		<>
			<div
				className={cn(
					'flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar ',
					containerClassName
				)}>
				{propTabs.map((tab, idx) => (
					<button
						key={tab.title}
						onClick={(e) => {
							e.preventDefault();
							tabSelected(tab);
						}}
						onMouseEnter={() => setHovering(true)}
						onMouseLeave={() => setHovering(false)}
						className={cn('relative px-4 py-2 rounded-full', tabClassName)}
						style={{
							transformStyle: 'preserve-3d',
						}}>
						{active.value === tab.value && (
							<motion.div
								layoutId='clickedbutton'
								transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
								className={cn(
									'absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-lg ',
									activeTabClassName
								)}
							/>
						)}

						<span className='relative block text-black dark:text-white'>
							{tab.title}
						</span>
					</button>
				))}
			</div>
			{/* <FadeInDiv
				tabs={tabs}
				active={active}
				key={active.value}
				hovering={hovering}
				className={cn('mt-32', contentClassName)}
			/> */}
		</>
	);
};

export const FadeInDiv = ({
	className,
	tabs,
	hovering,
}: {
	className?: string;
	key?: string;
	tabs: Tab[];
	active: Tab;
	hovering?: boolean;
}) => {
	const isActive = (tab: Tab) => {
		return tab.value === tabs[0].value;
	};
	return (
		<div className='relative w-full h-full'>
			{tabs.map((tab, idx) => (
				<motion.div
					key={tab.value}
					layoutId={tab.value}
					style={{
						scale: 1 - idx * 0.1,
						top: hovering ? idx * -50 : 0,
						zIndex: -idx,
						opacity: idx < 3 ? 1 - idx * 0.1 : 0,
					}}
					animate={{
						y: isActive(tab) ? [0, 40, 0] : 0,
					}}
					className={cn('w-full h-full absolute top-0 left-0', className)}>
					{tab.content}
				</motion.div>
			))}
		</div>
	);
};
