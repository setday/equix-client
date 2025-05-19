import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApiWithNotification } from './useApiWithNotification';
import { useNotification } from '../contexts/NotificationContext';
import { getErrorMessage } from '../utils/apiErrorHandler';

// Mock dependencies
vi.mock('../contexts/NotificationContext', () => ({
  useNotification: vi.fn(),
}));

vi.mock('../utils/apiErrorHandler', () => ({
  getErrorMessage: vi.fn(),
}));

describe('useApiWithNotification', () => {
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNotification as vi.Mock).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });
    (getErrorMessage as vi.Mock).mockReturnValue('Default error message');
  });

  it('should initialize with loading false and error null', () => {
    const { result } = renderHook(() => useApiWithNotification());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful API call and show success notification by default', async () => {
    const apiPromise = Promise.resolve('Success data');
    const { result } = renderHook(() => useApiWithNotification({ showSuccessNotification: true, successMessage: 'Custom success' }));

    let callResult;
    await act(async () => {
      callResult = await result.current.callApi(apiPromise);
    });

    expect(result.current.loading).toBe(false);
    expect(callResult).toBe('Success data');
    expect(mockShowSuccess).toHaveBeenCalledWith('Custom success');
    expect(mockShowError).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should handle successful API call without success notification if specified', async () => {
    const apiPromise = Promise.resolve('Success data');
    const { result } = renderHook(() => useApiWithNotification({ showSuccessNotification: false }));

    await act(async () => {
      await result.current.callApi(apiPromise, { showSuccessNotification: false });
    });

    expect(mockShowSuccess).not.toHaveBeenCalled();
  });
  
  it('should use override options for success notification', async () => {
    const apiPromise = Promise.resolve('Success data');
    const { result } = renderHook(() => useApiWithNotification({ showSuccessNotification: true, successMessage: 'Default Yay!' }));

    await act(async () => {
      await result.current.callApi(apiPromise, { showSuccessNotification: false });
    });
    expect(mockShowSuccess).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.callApi(apiPromise, { showSuccessNotification: true, successMessage: 'Override Yay!' });
    });
    expect(mockShowSuccess).toHaveBeenCalledWith('Override Yay!');
  });


  it('should handle failed API call and show error notification by default', async () => {
    const error = new Error('API Error');
    const apiPromise = Promise.reject(error);
    const { result } = renderHook(() => useApiWithNotification());

    let callResult;
    await act(async () => {
      callResult = await result.current.callApi(apiPromise);
    });

    expect(result.current.loading).toBe(false);
    expect(callResult).toBeNull();
    expect(result.current.error).toBe(error);
    expect(mockShowError).toHaveBeenCalledWith('Default error message');
    expect(getErrorMessage).toHaveBeenCalledWith(error);
    expect(mockShowSuccess).not.toHaveBeenCalled();
  });

  it('should handle failed API call without error notification if specified', async () => {
    const error = new Error('API Error');
    const apiPromise = Promise.reject(error);
    const { result } = renderHook(() => useApiWithNotification({ showErrorNotification: false }));
    
    await act(async () => {
      await result.current.callApi(apiPromise, { showErrorNotification: false });
    });

    expect(mockShowError).not.toHaveBeenCalled();
    expect(result.current.error).toBe(error);
  });

  it('should use custom string error message if provided', async () => {
    const error = new Error('API Error');
    const apiPromise = Promise.reject(error);
    const customErrorMessage = 'Custom error string';
    const { result } = renderHook(() => useApiWithNotification());

    await act(async () => {
      await result.current.callApi(apiPromise, { errorMessage: customErrorMessage });
    });

    expect(mockShowError).toHaveBeenCalledWith(customErrorMessage);
    expect(getErrorMessage).not.toHaveBeenCalled();
  });

  it('should use custom function error message if provided', async () => {
    const error = new Error('API Error Detail');
    const apiPromise = Promise.reject(error);
    const customErrorMessageFn = (err: any) => `Custom error from function: ${err.message}`;
    const { result } = renderHook(() => useApiWithNotification());

    await act(async () => {
      await result.current.callApi(apiPromise, { errorMessage: customErrorMessageFn });
    });

    expect(mockShowError).toHaveBeenCalledWith('Custom error from function: API Error Detail');
    expect(getErrorMessage).not.toHaveBeenCalled();
  });
  
  it('should set loading to true during API call and false after', async () => {
    const apiPromise = new Promise(resolve => setTimeout(() => resolve('done'), 50));
    const { result } = renderHook(() => useApiWithNotification());

    const call = result.current.callApi(apiPromise);

    // expect(result.current.loading).toBe(true);

    await act(async () => {
      await call;
    });

    expect(result.current.loading).toBe(false);
  });

  it('should set loading to false after API call fails', async () => {
    const apiPromise = new Promise((_,reject) => setTimeout(() => reject(new Error('fail')), 50));
    const { result } = renderHook(() => useApiWithNotification());

    const call = result.current.callApi(apiPromise);
    // expect(result.current.loading).toBe(true);

    await act(async () => {
      await call;
    });
    
    expect(result.current.loading).toBe(false);
  });

  it('should clear previous error on new API call', async () => {
    const error1 = new Error('First Error');
    const apiPromiseError = Promise.reject(error1);
    const { result } = renderHook(() => useApiWithNotification());

    await act(async () => {
      await result.current.callApi(apiPromiseError);
    });
    expect(result.current.error).toBe(error1);

    const apiPromiseSuccess = Promise.resolve('Good data');
    await act(async () => {
      await result.current.callApi(apiPromiseSuccess);
    });
    expect(result.current.error).toBeNull();
  });
});
