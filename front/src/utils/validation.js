export const validators = {
  required: (value) => (!value ? 'This field is required' : ''),
  
  email: (value) => {
    if (!value) return 'Email is required';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value) ? '' : 'Invalid email format';
  },
  
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/\d/.test(value)) return 'Password must contain at least one number';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    return '';
  },
  
  phone: (value) => {
    if (!value) return 'Phone number is required';
    const re = /^[0-9]{10}$/;
    return re.test(value) ? '' : 'Invalid phone number format';
  },
  
  price: (value) => {
    if (!value) return 'Price is required';
    if (isNaN(value) || value <= 0) return 'Price must be a positive number';
    return '';
  },
  
  images: (files) => {
    if (!files || files.length === 0) return 'At least one image is required';
    for (let file of files) {
      if (!file.type.startsWith('image/')) return 'All files must be images';
      if (file.size > 5 * 1024 * 1024) return 'Image size must be less than 5MB';
    }
    return '';
  }
};

export const validateForm = (values, rules) => {
  const errors = {};
  Object.keys(rules).forEach(key => {
    const value = values[key];
    const validations = rules[key];
    
    if (Array.isArray(validations)) {
      for (let validator of validations) {
        const error = validators[validator](value);
        if (error) {
          errors[key] = error;
          break;
        }
      }
    } else {
      const error = validators[validations](value);
      if (error) errors[key] = error;
    }
  });
  return errors;
}; 