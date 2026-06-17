export const calculateTotal = (amounts: { [key: string]: number | string }): number => {
    const total = Object.values(amounts).reduce<number>((sum, amount) => {
      const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
      return sum + numericAmount;
    }, 0);
  
    return total;
  };
  

