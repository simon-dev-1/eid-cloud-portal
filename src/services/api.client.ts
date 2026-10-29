import { config } from '../config';

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ErrorBody {
  message?: string;
  error?: string;
  errors?: { message?: string }[];
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | object;
}

const buildUrl = (path: string): string => `${config.apiBaseUrl}${path}`;

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as ErrorBody;
    if (typeof data.message === 'string' && data.message.length > 0) return data.message;
    if (typeof data.error === 'string' && data.error.length > 0) return data.error;
    if (Array.isArray(data.errors) && data.errors[0]?.message) {
      return data.errors[0].message;
    }
  } catch {
    // Response body was not JSON — fall through to the status-based message.
  }
  return `Request failed with status ${response.status}`;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { body, headers, ...rest } = options;
  const init: RequestInit = { ...rest };

  if (body instanceof FormData) {
    // Let the browser set the multipart boundary — do not set Content-Type.
    init.body = body;
  } else if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json', ...(headers as Record<string, string>) };
  } else {
    init.headers = headers;
  }

  const response = await fetch(buildUrl(path), init);

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const apiClient = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: 'GET', signal }),
  post: <T>(path: string, body?: BodyInit | object) => request<T>(path, { method: 'POST', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
