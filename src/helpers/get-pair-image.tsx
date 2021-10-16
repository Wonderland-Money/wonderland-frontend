import TimeMimSvg from "../assets/tokens/TIME-MIM.svg";
import TimeAvaxSvg from "../assets/tokens/TIME-AVAX.svg";
import { BONDS } from "../constants";
import { Icon } from "@material-ui/core";

export function getPairImage(name: string): JSX.Element {
  const viewBox = "0 0 62 32";
  const style = { height: "30px", width: "62px" };

  if (name === BONDS.avax_time) {
    return (
      //@ts-ignore
      <Icon viewBox={viewBox} style={style}>
        {/* @ts-ignore */}
        <img src={TimeAvaxSvg} viewBox={viewBox} style={style} />
      </Icon>
    );
  }

  if (name === BONDS.mim_time) {
    return (
      //@ts-ignore
      <Icon viewBox={viewBox} style={style}>
        {/* @ts-ignore */}
        <img src={TimeMimSvg} viewBox={viewBox} style={style} />
      </Icon>
    );
  }

  throw Error(`Pair image doesn't support: ${name}`);
}
