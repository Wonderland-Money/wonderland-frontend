export const shorten = (str: string): string => {
    if (str.length < 10) return str;
    return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
};
