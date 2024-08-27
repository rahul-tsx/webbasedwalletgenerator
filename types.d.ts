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
interface dollarChart {
	totalValue: number | null;
	percentageChange: string | null;
	priceDifference: string | null;
	currentPrice: number | null;
}
interface TokenMetadata {
	// The authority that can sign to update the metadata
	updateAuthority?: PublicKey;
	// The associated mint, used to counter spoofing to be sure that metadata belongs to a particular mint
	mint: PublicKey;
	// The longer name of the token
	name: string;
	// The shortened symbol for the token
	symbol: string;
	// The URI pointing to richer metadata
	uri: string;
	// Any additional metadata about the token as key-value pairs
	additionalMetadata?: [string, string][];
}

interface AccountToken {
	extensions: any[];
	isNative: boolean;
	mint: string;
	owner: string;
	state: string;
	tokenAmount: {
		amount: number;
		decimals: number;
		uiAmount: number;
		uiAmountString: string;
	};
}
type extensions = 'metadataPointer' | 'tokenMetadata';

interface ExtensionInterface {
	extension: extensions;
	state?: {
		additionalMetadata: [];
		mint: string;
		name: string;
		symbol: string;
		updateAuthority: string;
		uri: string;
	};
}
interface TokenData {
	mintAddress: {
		mint: string;
		amount: string;
	};
	tokenMetadataInfo: TokenMetadata | null;
	imageUrl: string | null;
}

type TabList = 'transactions' | 'tokens';
