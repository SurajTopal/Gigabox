import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
  fetchProductById,
  setSelectedCategory,
  setSearchQuery,
  clearSearch,
  setCurrentPage,
} from '../store/slices/productSlice';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    selectedProduct,
    categories,
    selectedCategory,
    searchResults,
    searchQuery,
    currentPage,
    loading,
    searching,
    error,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, limit: 30 }));
  }, [dispatch]);

  // Load products by category
  const loadProductsByCategory = useCallback(
    (category: string) => {
      dispatch(setSelectedCategory(category));
      dispatch(fetchProductsByCategory({ category, page: 0, limit: 30 }));
    },
    [dispatch],
  );

  // Search products with debounce
  const handleSearch = useCallback(
    (query: string) => {
      
      dispatch(setSearchQuery(query));

      if (query.trim()) {
        dispatch(searchProducts({ query, limit: 30 }));
      } else {
        dispatch(clearSearch());
      }
    },
    [dispatch],
  );

  // Get product by ID
  const loadProductDetails = useCallback(
    (id: number) => {
      dispatch(fetchProductById(id));
    },
    [dispatch],
  );

  // Load more products (pagination)
  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    dispatch(setCurrentPage(nextPage));
    dispatch(fetchProducts({ page: nextPage, limit: 30 }));
  }, [dispatch, currentPage]);

  // Reload products
  const reload = useCallback(() => {
    dispatch(setCurrentPage(0));
    if (selectedCategory) {
      dispatch(fetchProductsByCategory({ category: selectedCategory, page: 0, limit: 30 }));
    } else {
      dispatch(fetchProducts({ page: 0, limit: 30 }));
    }
  }, [dispatch, selectedCategory]);

  return {
    // State
    products,
    selectedProduct,
    categories,
    selectedCategory,
    searchResults,
    searchQuery,
    loading,
    searching,
    error,
    currentPage,

    // Actions
    loadProductsByCategory,
    handleSearch,
    loadProductDetails,
    loadMore,
    reload,
  };
};
