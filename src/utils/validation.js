export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\d\s\-+()]{7,15}$/;
  return re.test(phone);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateMinLength = (value, min) => {
  return value && value.length >= min;
};

export const validateEmployeeForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.firstName)) {
    errors.firstName = 'First name is required';
  }

  if (!validateRequired(formData.lastName)) {
    errors.lastName = 'Last name is required';
  }

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Invalid phone number';
  }

  if (!validateRequired(formData.department)) {
    errors.department = 'Department is required';
  }

  if (!validateRequired(formData.position)) {
    errors.position = 'Position is required';
  }

  return errors;
};
