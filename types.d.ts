type coinTypes = 'solana' | 'ethereum';
interface Wallet {
	name: string;
	publicKey: string;
	pathIndex: number;
	privateKey: string;
	coinType: coinTypes;
	slug: string;
	id: string;
}

type variantTypes = 'error' | 'success' | 'warning' | 'default';
type statusObj = { msg: string; variant: variantTypes };
