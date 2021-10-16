import { useSelector } from "react-redux";
import { trim, bondName, lpURL, isBondLP, priceUnits } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Paper, TableRow, TableCell, Slide, Link } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { useWeb3Context } from "../../hooks";

interface IBondProps {
  bond: string;
}

export function BondDataCard({ bond }: IBondProps) {
  const { chainID } = useWeb3Context();

  const isBondLoading = useSelector<IReduxState, boolean>(state => !state.bonding[bond]?.bondPrice ?? true);
  const bondPrice = useSelector<IReduxState, number | undefined>(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          <BondLogo bond={bond} />
          <div className="bond-name">
            <p className="bond-name-title">{bondName(bond)}</p>
            {isBondLP(bond) && (
              <div>
                <Link href={lpURL(bond, chainID)} target="_blank">
                  <p className="bond-name-title">View Contract</p>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="data-row">
          <p className="bond-name-title">Price</p>
          <p className="bond-price bond-name-title">
            <>
              {priceUnits(bond)} {isBondLoading ? <Skeleton width="50px" /> : trim(bondPrice, 2)}
            </>
          </p>
        </div>

        <div className="data-row">
          <p className="bond-name-title">ROI</p>
          <p className="bond-name-title">
            {isBondLoading ? <Skeleton width="50px" /> : `${trim(bondDiscount * 100, 2)}%`}
          </p>
        </div>

        <div className="data-row">
          <p className="bond-name-title">Purchased</p>
          <p className="bond-name-title">
            {isBondLoading ? (
              <Skeleton width="80px" />
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bondPurchased)
            )}
          </p>
        </div>
        <Link component={NavLink} to={`/mints/${bond}`}>
          <div className="bond-table-btn">
            <p>Mint {bondName(bond)}</p>
          </div>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond }: IBondProps) {
  const { chainID } = useWeb3Context();
  // Use BondPrice as indicator of loading.
  const isBondLoading = useSelector<IReduxState, boolean>(state => !state.bonding[bond]?.bondPrice ?? true);

  const bondPrice = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });

  return (
    <TableRow>
      <TableCell align="left">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <p className="bond-name-title">{bondName(bond)}</p>
          {isBondLP(bond) && (
            <Link color="primary" href={lpURL(bond, chainID)} target="_blank">
              <p className="bond-name-title">View Contract</p>
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="center">
        <p className="bond-name-title">
          <>
            <span className="currency-icon">{priceUnits(bond)}</span>{" "}
            {isBondLoading ? <Skeleton width="50px" /> : trim(bondPrice, 2)}
          </>
        </p>
      </TableCell>
      <TableCell align="right">
        <p className="bond-name-title">{isBondLoading ? <Skeleton /> : `${trim(bondDiscount * 100, 2)}%`}</p>
      </TableCell>
      <TableCell align="right">
        <p className="bond-name-title">
          {isBondLoading ? (
            <Skeleton />
          ) : (
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }).format(bondPurchased)
          )}
        </p>
      </TableCell>
      <TableCell>
        <Link component={NavLink} to={`/mints/${bond}`}>
          <div className="bond-table-btn">
            <p>Mint</p>
          </div>
        </Link>
      </TableCell>
    </TableRow>
  );
}
