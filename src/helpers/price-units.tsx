import { SvgIcon } from "@material-ui/core";
import { ReactComponent as UstImg } from "../assets/tokens/UST.svg";
import { ReactComponent as FraxImg } from "../assets/tokens/FRAX.svg";
import { IAllBondData } from "../hooks/bonds";
import { ust, frax } from "../helpers/bond";

export const priceUnits = (bond: IAllBondData) => {
    if (bond.name === ust.name) return <SvgIcon component={UstImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;
    if (bond.name === frax.name) return <SvgIcon component={FraxImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;

    return "$";
};
