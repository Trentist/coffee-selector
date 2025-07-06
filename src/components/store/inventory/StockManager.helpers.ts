export const calculateStockLevel = (current: number, min: number, max: number) => {
  if (current <= min) return "low";
  if (current >= max) return "high";
  return "normal";
};
