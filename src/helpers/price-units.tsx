import { SvgIcon } from "@material-ui/core";
import { ReactComponent as MimImg } from "../assets/tokens/MIM.svg";
import { IAllBondData } from "../hooks/bonds";
import { mim, mimPro } from "../helpers/bond";

export const priceUnits = (bond: IAllBondData) => {
    if (bond.name === mim.name || bond.name === mimPro.name) return <SvgIcon component={MimImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;

    return "$";
};
