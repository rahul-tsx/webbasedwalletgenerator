/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: '/airdropeth',
				destination:
					'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
                    
				permanent: false,
				basePath: false,
			},
		];
	},
};

export default nextConfig;
