// src/lib/retry.ts
// Retry logic for failed Supabase queries with exponential backoff
// Supports optional jitter and selective retry for transient errors only

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  /** If true, only retry on transient/network errors (default: false) */
  onlyTransient?: boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 500,
  maxDelay: 5000,
  onlyTransient: false,
};

/**
 * Retry a async function with exponential backoff
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Result of the function
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay, onlyTransient } = { ...DEFAULT_OPTIONS, ...options };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Skip retry for non-transient errors when onlyTransient is enabled
      if (onlyTransient && !isTransientError(lastError)) {
        throw lastError;
      }

      if (attempt < maxRetries) {
        const exponentialDelay = Math.min(
          baseDelay * Math.pow(2, attempt),
          maxDelay
        );
        // Add random jitter (±20%)
        const jitter = exponentialDelay * (0.8 + Math.random() * 0.4);
        const delay = Math.round(jitter);

        console.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms:`,
          lastError.message
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Check if an error is transient and worth retrying
 */
export function isTransientError(error: unknown): boolean {
  if (!error) return false;
  const msg = String(error).toLowerCase();
  return (
    msg.includes('timeout') ||
    msg.includes('network') ||
    msg.includes('econnrefused') ||
    msg.includes('econnreset') ||
    msg.includes('etimedout') ||
    msg.includes('5') // 5xx server errors
  );
}

/**
 * Execute multiple async functions with limited concurrency.
 * @param tasks - Array of async functions
 * @param concurrency - Max simultaneous executions (default: 3)
 * @returns Array of results in original order
 */
export async function throttledMap<T>(
  tasks: (() => Promise<T>)[],
  concurrency = 3
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (let i = 0; i < tasks.length; i++) {
    const promise = tasks[i]().then(result => {
      results[i] = result;
    });
    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(0, executing.findIndex(p => {
        // Remove completed promises from the executing list
        try { return Promise.race([p]); } catch { return true; }
      }));
    }
  }

  await Promise.all(executing);
  // Filter out holes from any skipped indices
  return tasks.map((_, i) => results[i]);
}
