import { NextRequest } from 'next/server';
import { APIError } from './api-error-handler';

export const getIdFromReq = (request: NextRequest) => {
  const id = request.nextUrl.pathname.split('/').pop();
  if (!id) throw new APIError('Instrument ID is required', 400);
  return id;
};

export type FetchResult<T> = {
  data: T | null;
  error: string | null;
  endpoint: string;
};

export async function fetchEndpointsParallel<T = unknown>(
  endpoints: string[],
  options?: RequestInit,
): Promise<FetchResult<T>[]> {
  try {
    const responses = await Promise.all(
      endpoints.map(endpoint => fetch(endpoint, options)),
    );

    const results: Promise<FetchResult<T>>[] = responses.map(
      async (res, index) => {
        if (!res.ok) {
          return {
            data: null,
            error: `Request failed with status ${res.status} for ${endpoints[index]}`,
            endpoint: endpoints[index],
          };
        }

        try {
          const data = await res.json();
          return {
            data,
            error: null,
            endpoint: endpoints[index],
          };
        } catch (parseError) {
          console.error(parseError);
          return {
            data: null,
            error: `Failed to parse JSON for ${endpoints[index]}`,
            endpoint: endpoints[index],
          };
        }
      },
    );

    return await Promise.all(results);
  } catch (error) {
    console.error(error);
    // Handle network errors or other fetch failures
    return endpoints.map(endpoint => ({
      data: null,
      error: `Network error occurred while fetching ${endpoint}`,
      endpoint,
    }));
  }
}

// enrollment error
export class EnrollmentError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.name = 'EnrollmentError';
    this.status = status;
  }
}
