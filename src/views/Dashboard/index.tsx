import { useSelector } from "react-redux";
import { Paper, Grid, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";

function Dashboard() {
  const isAppLoading = useSelector<IReduxState, boolean>(state => !state.app?.marketPrice ?? true);
  const marketPrice = useSelector<IReduxState, number>(state => {
    return state.app.marketPrice;
  });
  // const circSupply = useSelector<IReduxState, number>(state => {
  //   return state.app.circSupply;
  // });
  // const totalSupply = useSelector<IReduxState, number>(state => {
  //   return state.app.totalSupply;
  // });
  const marketCap = useSelector<IReduxState, number>(state => {
    return state.app.marketCap;
  });
  const stakingTVL = useSelector<IReduxState, number>(state => {
    return state.app.stakingTVL;
  });
  const stakingAPY = useSelector<IReduxState, number>(state => {
    return state.app.stakingAPY;
  });
  const currentIndex = useSelector<IReduxState, string>(state => {
    return state.app.currentIndex;
  });
  const treasuryBalance = useSelector<IReduxState, number>(state => {
    return state.app.treasuryBalance;
  });
  const rfv = useSelector<IReduxState, number>(state => {
    return state.app.rfv;
  });
  const runway = useSelector<IReduxState, number>(state => {
    return state.app.runway;
  });

  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  return (
    <div className="dashboard-view">
      <Zoom in={true}>
        <Paper className="ohm-card dashboard-paper">
          <Grid container spacing={1} className="top-row-data">
            <Grid item lg={6} md={6} sm={6} xs={12} className="olympus-card">
              <Zoom in={true}>
                <Paper className="ohm-card dashboard-card">
                  <p className="card-title">TIME Price</p>
                  <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 2)}`}</p>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Zoom in={true}>
                <Paper className="ohm-card dashboard-card">
                  <p className="card-title">Market Cap</p>
                  <p className="card-value">
                    {isAppLoading ? (
                      <Skeleton width="160px" />
                    ) : (
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(marketCap)
                    )}
                  </p>
                </Paper>
              </Zoom>
            </Grid>

            {/* <Grid item lg={6} md={6} sm={6} xs={12}>
              <Zoom in={true}>
                <Paper className="ohm-card dashboard-card">
                  <p className="card-title">Supply (Staked/Total)</p>
                  <p className="card-value">
                    {isAppLoading ? (
                      <Skeleton width="250px" />
                    ) : (
                      `${new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(circSupply)}
                        /
                        ${new Intl.NumberFormat("en-US", {
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        }).format(totalSupply)}`
                    )}
                  </p>
                </Paper>
              </Zoom>
            </Grid> */}

            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Zoom in={true}>
                <Paper className="ohm-card dashboard-card">
                  <p className="card-title">TVL</p>
                  <p className="card-value">
                    {isAppLoading ? (
                      <Skeleton width="250px" />
                    ) : (
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(stakingTVL)
                    )}
                  </p>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Zoom in={true}>
                <Paper className="ohm-card dashboard-card">
                  <p className="card-title">APY</p>
                  <p className="card-value">
                    {isAppLoading ? (
                      <Skeleton width="250px" />
                    ) : (
                      `${new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%`
                    )}
                  </p>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Zoom in={true}>
                <Paper className="ohm-card dashboard-card">
                  <p className="card-title">Current Index</p>
                  <p className="card-value">
                    {isAppLoading ? <Skeleton width="250px" /> : `${trim(Number(currentIndex), 2)} TIME`}
                  </p>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Zoom in={true}>
                <Paper className="ohm-card dashboard-card">
                  <p className="card-title">Treasury Balance</p>
                  <p className="card-value">
                    {isAppLoading ? (
                      <Skeleton width="250px" />
                    ) : (
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(treasuryBalance)
                    )}
                  </p>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Zoom in={true}>
                <Paper className="ohm-card dashboard-card">
                  <p className="card-title">Backing per $TIME</p>
                  <p className="card-value">
                    {isAppLoading ? (
                      <Skeleton width="250px" />
                    ) : (
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(rfv)
                    )}
                  </p>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Zoom in={true}>
                <Paper className="ohm-card dashboard-card">
                  <p className="card-title">Runway</p>
                  <p className="card-value">
                    {isAppLoading ? <Skeleton width="250px" /> : `${trim(Number(runway), 1)} Days`}
                  </p>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default Dashboard;
