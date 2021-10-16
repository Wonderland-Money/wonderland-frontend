import { SvgIcon } from "@material-ui/core";
import { ReactComponent as MimImg } from "../assets/tokens/MIM.svg";

export const priceUnits = (bond: string) => {
  if (bond === "mim")
    return <SvgIcon component={MimImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;

  return "$";
};
