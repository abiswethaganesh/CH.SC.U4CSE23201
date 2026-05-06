export const Log = async (stack, level, pkg, message) => {
  console.log(`[${level}] ${pkg}: ${message}`);
};