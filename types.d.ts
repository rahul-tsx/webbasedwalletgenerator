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

type SolanaChain = 'devnet' | 'mainnet' | 'testnet';
type EthereumChain = 'mainnet' | 'sepolia' | 'holesky';


interface ChainDetails<T extends string> {
	name: T;
	link: string;
}

interface CoinChainType {
	solana: { [key in SolanaChain]: ChainDetails<SolanaChain> };
	ethereum: { [key in EthereumChain]: ChainDetails<EthereumChain> };
}
type variantTypes = 'error' | 'success' | 'warning' | 'default';
type statusObj = { msg: string; variant: variantTypes };

interface DropdownValue {
	[(key in SolanaChain) | (key in EthereumChain)]: ChainDetails;
}
