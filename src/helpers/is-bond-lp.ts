export const isBondLP = (bond: string): boolean => {
  return bond.indexOf("_lp") >= 0;
};
