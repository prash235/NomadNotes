export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
} 

export const getInitials = (name) => {
    if (!name) return "";
  
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
  
    return (words[0][0] + words[1][0]).toUpperCase();
  };
  