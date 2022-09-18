import tokens, { mim } from "./tokens";

export default [...tokens];

export const EXCLUDED_TOKEN = [mim.address.toLocaleLowerCase()];
