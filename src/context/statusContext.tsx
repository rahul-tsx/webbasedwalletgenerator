import { createContext } from 'react';

interface StatusContextType {
	status: string | null;
	changeStatus: (message: string) => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export default StatusContext;
