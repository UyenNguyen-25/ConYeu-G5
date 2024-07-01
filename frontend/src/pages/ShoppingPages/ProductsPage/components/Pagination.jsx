import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Pagination = ({ hasNextPage, hasPrevPage, product }) => {
  console.log('product', product)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(product / Number(searchParams.get('per_page') || 8));
  const nav = useNavigate();

  const goToPage = (newPage) => {
  console.log('next page')
    const newSearchParams = new URLSearchParams(location.search);
    console.log('newSearchParams', newSearchParams)
    newSearchParams.set('page', String(newPage));
    nav(`/products?${newSearchParams.toString()}`)
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 border rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex gap-2 items-center justify-end mt-10">
      <button
        className="bg-blue-500 text-white p-1 rounded disabled:bg-gray-400"
        disabled={!hasPrevPage}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronsLeft/>
      </button>

      <div className="flex gap-1">
        {renderPageNumbers()}
      </div>

      <button
        className="bg-blue-500 text-white p-1 rounded disabled:bg-gray-400"
        disabled={!hasNextPage}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronsRight/>
      </button>
    </div>
  );
};

export default Pagination;