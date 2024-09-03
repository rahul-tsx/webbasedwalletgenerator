import type { Config } from 'tailwindcss';
import { default as flattenColorPalette } from 'tailwindcss/lib/util/flattenColorPalette';
import svgToDataUri from 'mini-svg-data-uri';

const config = {
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Background Colors
				mybackground: {
					dark: '#0f172a',
					// Black background for dark mode
					light: '#EFF9F0', // White background for light mode
				},
				// Text Colors
				text: {
					primary: '#82ff62', // Lime color for primary text
				},
				button: {
					primary: '#2DC7FF',
				},
				myCard: {
					primary: '#000B0C',
					secondary: '#00131A',
				},
				// Game Symbols
				x: '#FF6347', // Tomato color for "X"
				o: '#00FFFF', // Cyan color for "O"
				neonGreen: '#39FF14', // Neon green color for the "X"
				neonBlue: '#00FFFF', // Neon blue color for the "O"
				neonYellow: '#FFFF00',

				backgroundImage: {
					'myCard-gradient':
						'linear-gradient(90deg, #000B0C, #001620, #00131A)',
					'neon-gradient': 'linear-gradient(90deg, #00FFFF, #FFFF00)',
				},
				//ui library
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},

			boxShadow: {
				neon: '0 0 5px #FFFFFF, 0 0 10px #FFFFFF, 0 0 15px #00FFFF, 0 0 20px #00FFFF, 0 0 25px #FFFF00, 0 0 30px #FFFF00',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				wiggle: {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' },
				},
				bounceIn: {
					'0%': { opacity: '0', transform: 'scale(0.5)' },
					'80%': { opacity: '1', transform: 'scale(1.2)' },
					'100%': { transform: 'scale(1)' },
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideIn: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' },
				},
				pulseGlow: {
					'0%, 100%': { boxShadow: '0 0 15px #A3E635' },
					'50%': { boxShadow: '0 0 30px #A3E635' },
				},
				shimmer: {
					from: {
						backgroundPosition: '0 0',
					},
					to: {
						backgroundPosition: '-200% 0',
					},
				},

				meteor: {
					'0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
					'80%': { opacity: '1' },
					'100%': {
						transform: 'rotate(215deg) translateX(-1000px)',
						opacity: '0',
					},
				},
				gradientMove: {
					'0%': {
						'background-position': '0% 50%',
					},
					'50%': {
						'background-position': '100% 50%',
					},
					'100%': {
						'background-position': '0% 50%',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',

				wiggle: 'wiggle 0.5s ease-in-out infinite',
				bounceIn: 'bounceIn 0.6s ease-in-out',
				fadeIn: 'fadeIn 0.5s ease-out',
				slideIn: 'slideIn 0.4s ease-out',
				pulseGlow: 'pulseGlow 2s infinite ease-in-out',
				shimmer: 'shimmer 2s linear infinite',
				'meteor-effect': 'meteor 20s linear infinite',
				gradientMove: 'gradientMove 5s ease infinite',
			},
		},
	},
	variants: {
		extend: {
			// If you want to enable dark mode variants for specific utilities
			backgroundColor: ['dark'],
			textColor: ['dark'],
		},
	},

	plugins: [
		require('tailwindcss-animate'),
		addVariablesForColors,
		function ({ matchUtilities, theme }: any) {
			matchUtilities(
				{
					'bg-dot-thick': (value: any) => ({
						backgroundImage: `url("${svgToDataUri(
							`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
						)}")`,
					}),
				},
				{ values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
			);
		},
	],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
	let allColors = flattenColorPalette(theme('colors'));
	let newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		':root': newVars,
	});
}
export default config;
