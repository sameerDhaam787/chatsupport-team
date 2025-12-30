// API Client Service - Centralized API logic for team microservice
import type { Agent } from '../store/agentSlice';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  baseUrl?: string;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  account_status: number;
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',


};

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const API_BASE_URL = 'https://dev-nexus.dhaamai.com';

// "https://dev-nexus.dhaamai.com/docs"

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheExpiryMs = 5 * 60 * 1000; // 5 minutes default cache

  constructor(baseUrl = API_BASE_URL, timeout = DEFAULT_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Make a generic API request with error handling and logging
   */
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      baseUrl = this.baseUrl,
      timeout = this.timeout,
    } = options;

    const url = `${baseUrl}${endpoint}`;
    const mergedHeaders = { ...DEFAULT_HEADERS, ...headers };

    // Check cache for GET requests
    if (method === 'GET' && this.isCached(url)) {
      console.log('[ApiClient] Cache hit:', url);
      return { success: true, data: this.getFromCache(url), account_status: 200 };
    }

    try {
      console.log(`[ApiClient] ${method} ${url}`, body ? `Body: ${JSON.stringify(body)}` : '');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Clone response to read body multiple times if needed
      const responseText = await response.clone().text();
      let responseData: any;

      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        responseData = responseText;
      }

      console.log(
        `[ApiClient] Response: ${response.account_status} ${response.statusText}`,
        responseData
      );

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.account_status}: ${
            typeof responseData === 'string' ? responseData : JSON.stringify(responseData)
          }`,
          account_status: response.account_status,
        };
      }

      // Cache successful GET responses
      if (method === 'GET' && responseData) {
        this.setInCache(url, responseData);
      }

      return {
        success: true,
        data: responseData,
        account_status: response.account_status,
      };
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError'
        ? `Request timeout (${timeout}ms)`
        : error.message || 'Unknown error';

      console.error(`[ApiClient] Error:`, errorMessage);

      return {
        success: false,
        error: errorMessage,
        account_status: 0,
      };
    }
  }

  /**
   * POST request - convenience method
   */
  async post<T = any>(
    endpoint: string,
    body: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request - convenience method
   */
  async put<T = any>(
    endpoint: string,
    body: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * GET request - convenience method
   */
  async get<T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * DELETE request - convenience method
   */
  async delete<T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Cache management
   */
  private isCached(url: string): boolean {
    const cached = this.cache.get(url);
    if (!cached) return false;
    const isExpired = Date.now() - cached.timestamp > this.cacheExpiryMs;
    if (isExpired) {
      this.cache.delete(url);
      return false;
    }
    return true;
  }

  private getFromCache(url: string): any {
    return this.cache.get(url)?.data || null;
  }

  private setInCache(url: string, data: any): void {
    this.cache.set(url, { data, timestamp: Date.now() });
  }

  /**
   * Clear cache
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      const keys = Array.from(this.cache.keys()).filter((k) => k.includes(pattern));
      keys.forEach((k) => this.cache.delete(k));
    } else {
      this.cache.clear();
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

export default ApiClient;
