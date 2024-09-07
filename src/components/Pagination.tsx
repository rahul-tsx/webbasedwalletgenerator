import {
	BiLeftArrow as ArrowLeft,
	BiRightArrow as ArrowRight,
} from 'react-icons/bi';

interface PaginationProps {
	paginationSlots: number;
	totalPages: number;
	dataLength: number;
	startIndex: number;
	endIndex: number;
	currentPage: number;
	handlePageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	paginationSlots,
	totalPages,
	dataLength,
	startIndex,
	endIndex,
	currentPage,
	handlePageChange,
}) => {
	const renderPaginationSlots = () => {
		const startSlot = Math.max(
			currentPage - Math.floor(paginationSlots / 2),
			1
		);

		const endSlot = Math.min(startSlot + paginationSlots - 1, totalPages);

		return [...Array(endSlot - startSlot + 1)].map((_, index) => {
			const pageNumber = startSlot + index;
			return (
				<div
					key={pageNumber}
					className={`h-10 w-10 bg-${
						pageNumber === currentPage ? 'slate-950' : 'transparent'
					} rounded-full flex items-center justify-center text-Small font-SemiBold mr-3 border-white border-solid border cursor-pointer`}
					onClick={() => handlePageChange(pageNumber)}>
					{pageNumber}
				</div>
			);
		});
	};
	return (
		<div className='flex justify-between items-center w-full mb-5'>
			<p className=''>
				Showing
				<span className=' font-SemiBold'>{` ${startIndex + 1}-${
					endIndex > dataLength ? dataLength : endIndex
				} `}</span>
				from
				<span className=' font-semibold'>{` ${dataLength} `}</span>data
			</p>
			<div className='flex items-center space-x-4'>
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}>
					<ArrowLeft className='fill-current h-6 w-6 cursor-pointer' />
				</button>

				{renderPaginationSlots()}
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}>
					<ArrowRight className='fill-current h-6 w-6 cursor-pointer' />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
