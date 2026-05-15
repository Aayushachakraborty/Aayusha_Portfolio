export class ApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function attemptFetch(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new ApiError(
        payload?.detail || payload?.message || `Request failed with status ${response.status}`,
        { status: response.status, data: payload },
      );
    }

    return payload;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out.', { status: 408 });
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function apiFetch(path, options = {}) {
  const { timeoutMs = 8000, retry = 1, ...fetchOptions } = options;
  let lastError;

  for (let attempt = 0; attempt <= retry; attempt += 1) {
    try {
      return await attemptFetch(path, fetchOptions, timeoutMs);
    } catch (error) {
      lastError = error;
      const isNetworkError = error instanceof TypeError || error.status === 408;
      if (!isNetworkError || attempt === retry) break;
    }
  }

  throw lastError instanceof Error ? lastError : new ApiError('Unexpected API error.');
}
