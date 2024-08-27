import { FC } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface TooltipComponentProps {
	triggerValue: string | number;
	fullValue: string | number;
	unit?: string;
	triggerClassname?: string;
}

const TooltipComponent: FC<TooltipComponentProps> = ({
	triggerValue,
	fullValue,
	unit,
	triggerClassname,
}) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className={triggerClassname}>
					{triggerValue}
				</TooltipTrigger>
				<TooltipContent className='bg-slate-600 border-neonYellow'>
					<p>
						{fullValue} {unit}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipComponent;
