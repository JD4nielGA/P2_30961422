"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAmount = exports.validateExpiration = exports.validateCardNumber = exports.validateCVV = exports.validateText = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const res = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return res.test(email);
};
exports.validateEmail = validateEmail;
const validateText = (text, min, max) => {
    return text.length >= min && text.length <= max;
};
exports.validateText = validateText;
const validateNumericPattern = (value, minLength, maxLength, allowSpaces = false) => {
    const cleanedValue = allowSpaces ? value : value.replace(/\s+/g, '');
    const length = cleanedValue.length;
    return (length >= minLength &&
        length <= maxLength &&
        /^\d+$/.test(cleanedValue));
};
const validateCVV = (cvv) => {
    return validateNumericPattern(cvv, 3, 4);
};
exports.validateCVV = validateCVV;
const validateCardNumber = (cardNumber) => {
    return validateNumericPattern(cardNumber, 13, 19);
};
exports.validateCardNumber = validateCardNumber;
const validateExpiration = (month, year) => {
    const normalizedYear = year.length === 4 ? year.slice(-2) : year;
    const mmYY = `${month.padStart(2, '0')}${normalizedYear.padStart(2, '0')}`;
    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12)
        return false;
    const currentYear = new Date().getFullYear();
    const inputYear = parseInt(normalizedYear, 10) + 2000;
    return (inputYear >= currentYear &&
        inputYear <= currentYear + 10);
};
exports.validateExpiration = validateExpiration;
const validateAmount = (amount) => {
    return amount > 0 && amount <= 1000000;
};
exports.validateAmount = validateAmount;
