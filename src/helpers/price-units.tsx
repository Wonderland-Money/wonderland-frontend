import { SvgIcon } from "@material-ui/core";
import { ReactComponent as MimImg } from "../assets/tokens/MIM.svg";
import { ReactComponent as FraxImg } from "../assets/tokens/FRAX.svg";
import { IAllBondData } from "../hooks/bonds";
import { mim, frax } from "../helpers/bond";

export const priceUnits = (bond: IAllBondData) => {
    if (bond.name === mim.name) return <SvgIcon component={MimImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;
    if (bond.name === frax.name) return <SvgIcon component={FraxImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;

    return "$";
};
