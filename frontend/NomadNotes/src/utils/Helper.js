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
  

  export const getEmptyCardMessage = (filterType) => {
    switch(filterType){
        case "search":
        return "Oops ! no stories found";
        case "date":
        return "No stories found in the given Date range"

        default:
            return `Start creating your first travel story. Click the Add button`;
    }
  }