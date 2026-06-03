export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const calcSalaryBreakdown = (annualSalary) => {
  const basic = Math.round(annualSalary * 0.50);
  const hra = Math.round(annualSalary * 0.20);
  const da = Math.round(annualSalary * 0.10);
  const otherAllowances = annualSalary - basic - hra - da;
  const monthlyBasic = Math.round(basic / 12);
  const pf = Math.round(monthlyBasic * 0.12);
  const annualPf = pf * 12;

  const taxableIncome = annualSalary - annualPf;
  const tds = calcTDS(taxableIncome);
  const monthlyTds = Math.round(tds / 12);

  const monthlyGross = Math.round(annualSalary / 12);
  const monthlyDeductions = pf + monthlyTds;
  const monthlyNet = monthlyGross - monthlyDeductions;

  return {
    annual: annualSalary,
    basic, hra, da, otherAllowances,
    monthlyBasic,
    pf, annualPf,
    taxableIncome,
    tds, monthlyTds,
    monthlyGross, monthlyDeductions, monthlyNet,
  };
};

export const calcTDS = (taxableIncome) => {
  if (taxableIncome <= 300000) return 0;
  let tax = 0;
  if (taxableIncome > 300000) {
    const slab = Math.min(taxableIncome, 600000) - 300000;
    tax += slab * 0.05;
  }
  if (taxableIncome > 600000) {
    const slab = Math.min(taxableIncome, 900000) - 600000;
    tax += slab * 0.10;
  }
  if (taxableIncome > 900000) {
    const slab = Math.min(taxableIncome, 1200000) - 900000;
    tax += slab * 0.15;
  }
  if (taxableIncome > 1200000) {
    const slab = Math.min(taxableIncome, 1500000) - 1200000;
    tax += slab * 0.20;
  }
  if (taxableIncome > 1500000) {
    const slab = taxableIncome - 1500000;
    tax += slab * 0.30;
  }
  return Math.round(tax);
};

export const getProfilePhoto = (email) => {
  try {
    return localStorage.getItem(`profilePhoto_${email}`);
  } catch { return null; }
};

export const saveProfilePhoto = (email, dataUrl) => {
  try {
    localStorage.setItem(`profilePhoto_${email}`, dataUrl);
  } catch (e) {
    console.error('Failed to save profile photo:', e);
  }
};
