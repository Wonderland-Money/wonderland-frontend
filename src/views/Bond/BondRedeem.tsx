import { useSelector, useDispatch } from "react-redux";
import { Box, Slide } from "@material-ui/core";
import { redeemBond } from "../../store/slices/bond-slice";
import { useWeb3Context } from "../../hooks";
import { trim, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../../helpers";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";

interface IBondRedeem {
  bond: string;
}

function BondRedeem({ bond }: IBondRedeem) {
  const dispatch = useDispatch();
  const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

  const currentBlockTime = useSelector<IReduxState, number>(state => {
    return state.app.currentBlockTime;
  });

  const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
  const bondMaturationBlock = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bond] && state.account[bond].bondMaturationBlock;
  });

  const vestingTerm = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].vestingTerm;
  });

  const interestDue = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bond] && state.account[bond].interestDue;
  });

  const pendingPayout = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bond] && state.account[bond].pendingPayout;
  });

  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  async function onRedeem(autostake: boolean) {
    if (checkWrongNetwork()) return;

    await dispatch(redeemBond({ address, bond, networkID: chainID, provider, autostake }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlockTime, bondMaturationBlock);
  };

  const vestingPeriod = () => {
    return prettifySeconds(vestingTerm, "day");
  };

  const bondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });

  const debtRatio = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].debtRatio;
  });

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        <div
          className="transaction-button bond-approve-btn"
          onClick={() => {
            if (isPendingTxn(pendingTransactions, "redeem_bond_" + bond)) return;
            onRedeem(false);
          }}
        >
          <p>{txnButtonText(pendingTransactions, "redeem_bond_" + bond, "Claim")}</p>
        </div>
        <div
          className="transaction-button bond-approve-btn"
          onClick={() => {
            if (isPendingTxn(pendingTransactions, "redeem_bond_" + bond + "_autostake")) return;
            onRedeem(true);
          }}
        >
          <p>{txnButtonText(pendingTransactions, "redeem_bond_" + bond + "_autostake", "Claim and Autostake")}</p>
        </div>
      </Box>

      <Slide direction="right" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <p className="bond-balance-title">Pending Rewards</p>
            <p className="price-data bond-balance-title">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(interestDue, 4)} TIME`}
            </p>
          </div>
          <div className="data-row">
            <p className="bond-balance-title">Claimable Rewards</p>
            <p className="price-data bond-balance-title">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(pendingPayout, 4)} TIME`}
            </p>
          </div>
          <div className="data-row">
            <p className="bond-balance-title">Time until fully vested</p>
            <p className="price-data bond-balance-title">
              {isBondLoading ? <Skeleton width="100px" /> : vestingTime()}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">ROI</p>
            <p className="bond-balance-title">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bondDiscount * 100, 2)}%`}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">Debt Ratio</p>
            <p className="bond-balance-title">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(debtRatio, 2)}%`}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">Vesting Term</p>
            <p className="bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</p>
          </div>
        </Box>
      </Slide>
    </Box>
  );
}

export default BondRedeem;
