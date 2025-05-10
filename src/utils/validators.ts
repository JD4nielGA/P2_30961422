export const validateEmail = (email: string): boolean => {
  const res = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return res.test(email);
};

export const validateText = (
  text: string,
  min: number,
  max: number
): boolean => {
  return text.length >= min && text.length <= max;
};

const validateNumericPattern = (
  value: string,
  minLength: number,
  maxLength: number,
  allowSpaces: boolean = false
): boolean => {
  const cleanedValue = allowSpaces ? value : value.replace(/\s+/g, '');
  const length = cleanedValue.length;
  
  return (
    length >= minLength &&
    length <= maxLength &&
    /^\d+$/.test(cleanedValue)
  );
};

export const validateCVV = (cvv: string): boolean => {
  return validateNumericPattern(cvv, 3, 4);
};

export const validateCardNumber = (cardNumber: string): boolean => {
  return validateNumericPattern(cardNumber, 13, 19);
};

export const validateExpiration = (month: string, year: string): boolean => {
  const normalizedYear = year.length === 4 ? year.slice(-2) : year;
  
  const mmYY = `${month.padStart(2, '0')}${normalizedYear.padStart(2, '0')}`;
  
  const monthNum = parseInt(month, 10);
  if (monthNum < 1 || monthNum > 12) return false;
  
  const currentYear = new Date().getFullYear();
  const inputYear = parseInt(normalizedYear, 10) + 2000; 
  
  return (
    inputYear >= currentYear && 
    inputYear <= currentYear + 10
  );
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1_000_000;
};
