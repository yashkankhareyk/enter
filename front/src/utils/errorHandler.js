export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error, setError, setLoading) => {
  console.error('Error:', error);
  
  if (setLoading) setLoading(false);
  
  if (error.response) {
    // API error response
    setError(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // Network error
    setError('Network error. Please check your connection.');
  } else {
    // Other errors
    setError(error.message || 'An unexpected error occurred');
  }
}; 