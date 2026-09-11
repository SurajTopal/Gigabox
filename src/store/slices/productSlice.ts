import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api, Product } from '../../api/dummyJsonApi';

export interface ProductState {
  // Products
  products: Product[];
  selectedProduct: Product | null;
  totalProducts: number;

  // Categories
  categories: string[];
  selectedCategory: string | null;

  // Search
  searchResults: Product[];
  searchQuery: string;

  // Pagination
  currentPage: number;
  limit: number;

  // Loading & Error States
  loading: boolean;
  searching: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  totalProducts: 0,
  categories: [],
  selectedCategory: null,
  searchResults: [],
  searchQuery: '',
  currentPage: 0,
  limit: 30,
  loading: false,
  searching: false,
  error: null,
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    { page = 0, limit = 30 }: { page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    const skip = page * limit;
    const response = await api.getProducts(skip, limit);

    if (!response.success) {
      return rejectWithValue(response.error);
    }

    return response.data;
  },
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    const response = await api.getCategories();

    if (!response.success) {
      return rejectWithValue(response.error);
    }

    return response.data;
  },
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (
    {
      category,
      page = 0,
      limit = 30,
    }: { category: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    const skip = page * limit;
    const response = await api.getProductsByCategory(category, skip, limit);

    if (!response.success) {
      return rejectWithValue(response.error);
    }

    return response.data;
  },
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, limit = 30 }: { query: string; limit?: number }, { rejectWithValue }) => {
    if (!query.trim()) {
      return rejectWithValue('Search query cannot be empty');
    }

    const response = await api.searchProducts(query, limit);

    if (!response.success) {
      return rejectWithValue(response.error);
    }

    return response.data;
  },
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    const response = await api.getProductById(id);

    if (!response.success) {
      return rejectWithValue(response.error);
    }

    return response.data;
  },
);

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 0; // Reset to first page when category changes
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
      api.cancelSearch();
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products (append for pagination, replace for first page)
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const newProducts = action.payload?.products || [];
        // Page 0: replace all, else append for infinite scroll
        if (state.currentPage === 0) {
          state.products = newProducts;
        } else {
          state.products.push(...newProducts);
        }
        state.totalProducts = action.payload?.total || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Products by Category (append for pagination, replace for first page)
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        const newProducts = action.payload?.products || [];
        // Page 0: replace all, else append for infinite scroll
        if (state.currentPage === 0) {
          state.products = newProducts;
        } else {
          state.products.push(...newProducts);
        }
        state.totalProducts = action.payload?.total || 0;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search Products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.searching = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searching = false;
        state.searchResults = action.payload?.products || [];
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searching = false;
        state.error = action.payload as string;
      });

    // Fetch Product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload || null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCategory, setSearchQuery, clearSearch, setCurrentPage, clearError } =
  productSlice.actions;

export default productSlice.reducer;
