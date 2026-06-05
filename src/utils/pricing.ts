export const calculateDynamicPrice = (basePrice: number, stock: number): number => {
  if (stock <= 5) {
    return Math.round(basePrice * 1.15); // Increase by 15%
  }
  return basePrice;
};
