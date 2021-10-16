import { useSelector } from "react-redux";
import {
  Paper,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Zoom,
} from "@material-ui/core";
import { BondTableData, BondDataCard } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import { useBonds } from "../../hooks";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";

function ChooseBond() {
  const bonds = useBonds();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const marketPrice = useSelector<IReduxState, number>(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useSelector<IReduxState, number>(state => {
    return state.app.treasuryBalance;
  });

  return (
    <div id="choose-bond-view">
      <Zoom in={true}>
        <Paper className="ohm-card">
          <Box className="card-header">
            <p className="bond-title">
              Mint ({String.fromCodePoint(0x1fad6)}, {String.fromCodePoint(0x1fad6)})
            </p>
          </Box>

          <Grid container item xs={12} style={{ margin: "10px 0px 20px" }} className="bond-hero">
            <Grid item xs={6}>
              <Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
                <p className="bond-hero-title">Treasury Balance</p>
                <p className="bond-hero-value">
                  {isAppLoading ? (
                    <Skeleton width="180px" />
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(treasuryBalance)
                  )}
                </p>
              </Box>
            </Grid>

            <Grid item xs={6} className={`ohm-price`}>
              <Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
                <p className="bond-hero-title">TIME Price</p>
                <p className="bond-hero-value">
                  {isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 2)}`}
                </p>
              </Box>
            </Grid>
          </Grid>

          {!isSmallScreen && (
            <Grid container item>
              <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <p className="bond-table-title">Mint</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="bond-table-title">Price</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="bond-table-title">ROI</p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="bond-table-title">Purchased</p>
                      </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bonds.map(bond => (
                      <BondTableData key={bond.value} bond={bond.value} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Paper>
      </Zoom>

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bonds.map(bond => (
              <Grid item xs={12} key={bond.value}>
                <BondDataCard key={bond.value} bond={bond.value} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default ChooseBond;
