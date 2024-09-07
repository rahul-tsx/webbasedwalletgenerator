import { HeroHighlight } from '@/components/ui/hero-highlight';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
export default function Home() {
	return (
		<main className=''>
			<HeroHighlight
				containerClassName='h-fit items-start justify-start'
				className='w-full myContainer'>
				<Navbar />
			</HeroHighlight>
			<HeroSection />
		</main>
	);
}
