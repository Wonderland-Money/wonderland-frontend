import { Box } from "@material-ui/core";
import { Bond } from "../helpers/bond/bond";

interface IBondLogoProps {
    bond: Bond;
}

function BondLogo({ bond }: IBondLogoProps) {
    let style = { height: "32px", width: "32px" };

    if (bond.isLP) {
        style = { height: "30px", width: "62px" };
    }

    return (
        <Box display="flex" alignItems="center" justifyContent="center" width={"64px"}>
            <img src={bond.bondIconSvg} style={style} />
        </Box>
    );
}

export default BondLogo;
