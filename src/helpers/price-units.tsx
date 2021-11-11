import { SvgIcon } from "@material-ui/core";
import { ReactComponent as UstImg } from "../assets/tokens/UST.svg";
import { ReactComponent as FraxImg } from "../assets/tokens/FRAX.svg";
import { IAllBondData } from "../hooks/bonds";
import { ust, frax } from "../helpers/bond";

export const priceUnits = (bond: IAllBondData) => {
    if (bond.name === ust.name) return <SvgIcon component={UstImg} viewBox="0 0 180 180" style={{ height: "12px", width: "12px" }} />;
    if (bond.name === frax.name) return <SvgIcon component={FraxImg} viewBox="20 0 180 180" style={{ height: "12px", width: "12px" }} />;

    return "$";
};
