"use server";

export const generatePageKey = (): number => {
  const secretMultiplier = Number(process.env.SECRET_MULTIPLIER) || 23;
  
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // Months are zero-based
  const year = today.getFullYear();

  return (day + month + year) * secretMultiplier;
}