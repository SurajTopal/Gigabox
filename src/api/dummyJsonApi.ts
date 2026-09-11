import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Types - Product data from dummyjson API
export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
  discountPercentage: number;
  description?: string;
  reviews?: Review[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Store active requests for cancellation
let activeSearchController: AbortController | null = null;

// API Methods
export const api = {
  // Get all products with pagination
  async getProducts(
    skip: number = 0,
    limit: number = 30,
  ): Promise<ApiResponse<ProductsResponse>> {
    try {
      const response = await apiClient.get<ProductsResponse>(
        `/products?skip=${skip}&limit=${limit}`,
      );
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // Search products with request cancellation
  async searchProducts(
    query: string,
    limit: number = 30,
  ): Promise<ApiResponse<ProductsResponse>> {
    try {
      // Cancel previous search request if it exists
      if (activeSearchController) {
        activeSearchController.abort();
      }

      // Create new abort controller for this request
      activeSearchController = new AbortController();

      const response = await apiClient.get<ProductsResponse>(
        `/products/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          signal: activeSearchController.signal,
        },
      );

      activeSearchController = null;
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        return {
          success: false,
          error: 'Search request cancelled',
          status: 0,
        };
      }
      return handleError(error);
    }
  },

  // Get products by category
  async getProductsByCategory(
    category: string,
    skip: number = 0,
    limit: number = 30,
  ): Promise<ApiResponse<ProductsResponse>> {
    try {
      const response = await apiClient.get<ProductsResponse>(
        `/products/category/${encodeURIComponent(category)}?skip=${skip}&limit=${limit}`,
      );
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // Get all categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.get<any>('/products/categories');

      // Handle both string array and object array responses
      let categories: string[] = [];
      if (Array.isArray(response.data)) {
        categories = response.data.map((cat: any) =>
          typeof cat === 'string' ? cat : cat.name || cat.slug || String(cat)
        );
      }

      return {
        success: true,
        data: categories,
        status: response.status,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // Get single product details
  async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // Cancel any pending search request
  cancelSearch(): void {
    if (activeSearchController) {
      activeSearchController.abort();
      activeSearchController = null;
    }
  },
};

// Error handler
function handleError(error: unknown): ApiResponse<any> {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      error: axiosError.message || 'API Error',
      status: axiosError.response?.status || 0,
    };
  }

  return {
    success: false,
    error: 'Unknown error occurred',
    status: 0,
  };
}
