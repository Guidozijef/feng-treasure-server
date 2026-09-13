export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  total?: number;
  timestamp: number;
}

export function success<T>(data: T, message = 'success', total?: number): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
    ...(total !== undefined ? { total } : {}),
    timestamp: Date.now(),
  };
}

export function error(message = 'error', code = 500, data: any = null): ApiResponse {
  return {
    code,
    message,
    data,
    timestamp: Date.now(),
  };
}
