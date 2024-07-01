import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const usePagination = (items) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || 8;

  const start = (Number(page) - 1) * Number(perPage);
  const end = start + Number(perPage);

  const paginatedItems = useMemo(() => items.slice(start, end), [items, start, end]);

  return {
    paginatedItems,
    hasNextPage: end < items.length,
    hasPrevPage: start > 0,
    currentPage: Number(page),
    perPage: Number(perPage)
  };
};

export default usePagination;