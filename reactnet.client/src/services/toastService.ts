import toast from 'react-hot-toast';

// Service for displaying notifications using react-hot-toast
const toastService = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  },
  
  // Show API error messages (handle errors object format from validation errors)
  apiError: (error: any) => {
    if (!error) {
      toastService.error('An unknown error occurred');
      return;
    }
    
    // Handle axios error responses
    if (error.response) {
      const { data } = error.response;
      
      // Format 1: Handle validation error object format where errors is an object with arrays
      // Example: { errors: { "field1": ["error1", "error2"], "field2": ["error3"] } }
      if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
        let errorDisplayed = false;
        
        Object.keys(data.errors).forEach(field => {
          const fieldErrors = data.errors[field];
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            fieldErrors.forEach(errorMsg => {
              toast.error(errorMsg, {
                duration: 4000,
                position: 'top-right',
              });
              errorDisplayed = true;
            });
          }
        });
        
        // If we displayed at least one error, return
        if (errorDisplayed) return;
      }
      
      // Format 2: Handle array of error messages
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        data.errors.forEach((err: string) => {
          toast.error(err, {
            duration: 4000,
            position: 'top-right',
          });
        });
        return;
      }
      
      // Format 3: Handle single error message
      if (data?.message) {
        toast.error(data.message, {
          duration: 4000,
          position: 'top-right',
        });
        return;
      }
      
      // Format 4: Handle title as error message
      if (data?.title) {
        toast.error(data.title, {
          duration: 4000,
          position: 'top-right',
        });
        return;
      }
    }
    
    // Default error message
    toast.error(error.message || 'An unexpected error occurred', {
      duration: 4000,
      position: 'top-right',
    });
  }
};

export default toastService; 