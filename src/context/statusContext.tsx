import { createContext } from 'react';

interface StatusContextType {
	status: statusObj | null;
	changeStatus: (message: string, variant?: variantTypes) => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export default StatusContext;
