import { isBondLP, getTokenImage, getPairImage } from "../helpers";
import { Box } from "@material-ui/core";

interface IBondHeaderProps {
  bond: string;
}

function BondHeader({ bond }: IBondHeaderProps) {
  const reserveAssetImg = () => {
    if (bond.indexOf("mim") >= 0) {
      return getTokenImage("mim");
    } else if (bond.indexOf("wavax") >= 0) {
      return getTokenImage("wavax");
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={"64px"}>
      {isBondLP(bond) ? getPairImage(bond) : reserveAssetImg()}
    </Box>
  );
}

export default BondHeader;
