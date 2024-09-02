// usePagination.js
import { useState } from 'react';

const usePagination = (itemsPerPage:number, dataLength:number, paginationSlots:number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const calculatePagination = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(dataLength / itemsPerPage);

    return {
      startIndex,
      endIndex,
      totalPages,
    };
  };

  const handlePageChange = (newPage:number) => {
    setCurrentPage(newPage);
  };

  const { startIndex, endIndex, totalPages } = calculatePagination();

  return {
    currentPage,
    startIndex,
    endIndex,
    totalPages,
    handlePageChange,
  };
};

export default usePagination;
