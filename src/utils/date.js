export const getUnlockedDays = () => {
  const today = new Date();
  return today.getMonth() === 1
    ? today.getDate()
    : 0;
};