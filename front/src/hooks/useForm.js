import { useState, useEffect } from 'react';
import { validateForm } from '../utils/validation';

export const useForm = (initialValues, validationRules, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const formErrors = validateForm(values, validationRules);
      setErrors(formErrors);
      
      if (Object.keys(formErrors).length === 0) {
        onSubmit(values);
      }
      setIsSubmitting(false);
    }
  }, [isSubmitting, values, validationRules, onSubmit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const fieldError = validateForm({ [name]: value }, { [name]: validationRules[name] });
      setErrors(prev => ({ ...prev, [name]: fieldError[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const fieldError = validateForm({ [name]: values[name] }, { [name]: validationRules[name] });
    setErrors(prev => ({ ...prev, [name]: fieldError[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    setIsSubmitting(true);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  };
}; 