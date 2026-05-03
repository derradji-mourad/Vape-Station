import { useState, useCallback } from "react";

export type AsyncActionState = "idle" | "loading" | "success" | "error";

interface UseAsyncActionOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    successResetMs?: number;
    errorResetMs?: number;
}

interface UseAsyncActionReturn<T> {
    execute: (asyncFn: () => Promise<T>) => Promise<T | undefined>;
    state: AsyncActionState;
    error: Error | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    reset: () => void;
}

/**
 * Custom hook for managing async operations with loading states.
 * Provides loading, success, and error states with auto-reset.
 * Use for Edge Function calls and other async operations.
 */
export function useAsyncAction<T = void>(
    options: UseAsyncActionOptions = {}
): UseAsyncActionReturn<T> {
    const {
        onSuccess,
        onError,
        successResetMs = 2000,
        errorResetMs = 3000,
    } = options;

    const [state, setState] = useState<AsyncActionState>("idle");
    const [error, setError] = useState<Error | null>(null);

    const reset = useCallback(() => {
        setState("idle");
        setError(null);
    }, []);

    const execute = useCallback(
        async (asyncFn: () => Promise<T>): Promise<T | undefined> => {
            setState("loading");
            setError(null);

            try {
                const result = await asyncFn();
                setState("success");
                onSuccess?.();

                // Auto-reset after success
                setTimeout(() => {
                    setState((current) => (current === "success" ? "idle" : current));
                }, successResetMs);

                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                setState("error");
                setError(error);
                onError?.(error);

                // Auto-reset after error
                setTimeout(() => {
                    setState((current) => (current === "error" ? "idle" : current));
                    setError(null);
                }, errorResetMs);

                return undefined;
            }
        },
        [onSuccess, onError, successResetMs, errorResetMs]
    );

    return {
        execute,
        state,
        error,
        isLoading: state === "loading",
        isSuccess: state === "success",
        isError: state === "error",
        reset,
    };
}
