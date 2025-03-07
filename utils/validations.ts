export const validateEmail = (email: string): boolean => {
    const regex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    return regex.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };
  