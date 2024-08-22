export const coinUnit = {
	solana: 'SOL',
	ethereum: 'ETH',
	bitcoin: 'BTC',
};

export const coinChain: CoinChainType = {
	solana: {
		devnet: { name: 'devnet', link: 'https://api.devnet.solana.com' },
		mainnet: {
			name: 'mainnet',
			link: process.env.NEXT_PUBLIC_SOL_MAINNET_PROVIDER_URL!,
		},
		testnet: { name: 'testnet', link: 'https://api.testnet.solana.com' },
	},
	ethereum: {
		mainnet: {
			name: 'mainnet',
			link: process.env.NEXT_PUBLIC_ETH_MAINNET_PROVIDER2_URL!,
		},
		sepolia: {
			name: 'sepolia',
			link: process.env.NEXT_PUBLIC_ETH_SEPOLIA_PROVIDER_URL!,
		},
		holesky: {
			name: 'holesky',
			link: process.env.NEXT_PUBLIC_ETH_HOLESKY_PROVIDER_URL!,
		},
	},
};



export const solPriceUrl = 'https://api.coinbase.com/v2/prices/SOL-USD/spot';
export const ethPriceUrl = 'https://api.coinbase.com/v2/prices/ETH-USD/spot';
