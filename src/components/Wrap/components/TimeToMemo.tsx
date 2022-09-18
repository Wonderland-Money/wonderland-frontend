import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "../../../store/slices/state.interface";
import { trim } from "../../../helpers/trim";
import { ReactComponent as ArrowsIcon } from "../../../assets/icons/arrows.svg";
import { useWeb3Context } from "../../../hooks";
import { changeStake, changeApproval } from "../../../store/slices/stake-thunk";
import { warning } from "src/store/slices/messages-slice";
import { messages } from "../../../constants/messages";
import { Skeleton } from "@material-ui/lab";
import { IconButton, InputAdornment, OutlinedInput, SvgIcon } from "@material-ui/core";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../../store/slices/pending-txns-slice";

interface MemoToWmemoProps {
    isWrap: boolean;
    setValue: (value: string) => void;
    setIsWrap: (value: boolean) => void;
    setIsWrapPrice: (value: boolean) => void;
    value: string;
}

export default function ({ isWrap, setValue, setIsWrap, setIsWrapPrice, value }: MemoToWmemoProps) {
    const dispatch = useDispatch();
    const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

    const timeBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.time;
    });

    const memoBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.memo;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const stakeAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.time;
    });

    const unstakeAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.memo;
    });

    const setMax = () => {
        if (isWrap) {
            setValue(timeBalance);
        } else {
            setValue(memoBalance);
        }
    };

    const handleSwap = () => {
        setValue("");
        const value = !isWrap;
        setIsWrap(value);
        setIsWrapPrice(value);
    };

    const handleValueChange = (e: any) => {
        const value = e.target.value;
        setValue(value);
    };

    const hasAllowance = useCallback(
        token => {
            if (token === "time") return stakeAllowance > 0;
            if (token === "memo") return unstakeAllowance > 0;
            return 0;
        },
        [stakeAllowance, unstakeAllowance],
    );

    const trimmedMemoBalance = trim(Number(memoBalance), 6);
    const trimmedTimeBalance = trim(Number(timeBalance), 6);

    const getBalance = () => (isWrap ? `${trimmedTimeBalance} TIME` : `${trimmedMemoBalance} MEMO`);

    const onChangeStake = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (value === "" || parseFloat(value) === 0) {
            dispatch(warning({ text: action === "stake" ? messages.before_stake : messages.before_unstake }));
        } else {
            await dispatch(changeStake({ address, action, value, provider, networkID: chainID }));
            setValue("");
        }
    };

    const onSeekApproval = async (token: string) => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    return (
        <>
            <div className="wrap-header-conteiner">
                <p className="wrap-header-title">{isWrap ? "Wrap" : "Unwrap"}</p>
                <p className="wrap-header-balance">Balance: {isAppLoading ? <Skeleton width="80px" /> : <>{getBalance()}</>}</p>
            </div>

            <div className="wrap-container">
                <OutlinedInput
                    placeholder="Amount"
                    value={value}
                    onChange={handleValueChange}
                    fullWidth
                    type="number"
                    className="bond-input wrap-input"
                    startAdornment={
                        <InputAdornment position="start">
                            <div className="wrap-action-input-text">
                                <p>{isWrap ? "TIME" : "MEMO"}</p>
                            </div>
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <div onClick={setMax} className="wrap-action-input-btn">
                                <p>Max</p>
                            </div>
                        </InputAdornment>
                    }
                />
                <div className="wrap-toggle">
                    <IconButton onClick={handleSwap}>
                        <SvgIcon color="primary" component={ArrowsIcon} />
                    </IconButton>
                </div>
                <OutlinedInput
                    placeholder="Amount"
                    value={value}
                    disabled
                    fullWidth
                    type="number"
                    className="bond-input wrap-input"
                    startAdornment={
                        <InputAdornment position="start">
                            <div className="wrap-action-input-text">
                                <p>{isWrap ? "MEMO" : "TIME"}</p>
                            </div>
                        </InputAdornment>
                    }
                />
                {isWrap ? (
                    hasAllowance("time") ? (
                        <div
                            className="wrap-btn"
                            onClick={() => {
                                if (isPendingTxn(pendingTransactions, "staking")) return;
                                onChangeStake("stake");
                            }}
                        >
                            <p>{txnButtonText(pendingTransactions, "staking", "Wrap")}</p>
                        </div>
                    ) : (
                        <div
                            className="wrap-btn"
                            onClick={() => {
                                if (isPendingTxn(pendingTransactions, "approve_staking")) return;
                                onSeekApproval("time");
                            }}
                        >
                            <p>{txnButtonText(pendingTransactions, "approve_staking", "Approve")}</p>
                        </div>
                    )
                ) : hasAllowance("memo") ? (
                    <div
                        className="wrap-btn"
                        onClick={() => {
                            if (isPendingTxn(pendingTransactions, "unstaking")) return;
                            onChangeStake("unstake");
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "unstaking", "Unwrap")}</p>
                    </div>
                ) : (
                    <div
                        className="wrap-btn"
                        onClick={() => {
                            if (isPendingTxn(pendingTransactions, "approve_unstaking")) return;
                            onSeekApproval("memo");
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}</p>
                    </div>
                )}
                {((!hasAllowance("time") && isWrap) || (!hasAllowance("memo") && !isWrap)) && (
                    <div className="wrap-help-text">
                        <p>Note: The "Approve" transaction is only needed when</p>
                        <p>wrapping/unwrapping for the first time; subsequent wrapping/unwrapping only</p>
                        <p>requires you to perform the "Wrap" transaction.</p>
                    </div>
                )}
            </div>
        </>
    );
}

interface TimeToMemoPriceProps {
    isWrapPrice: boolean;
    setIsWrapPrice: (status: boolean) => void;
}

export const TimeToMemoPrice = ({ isWrapPrice, setIsWrapPrice }: TimeToMemoPriceProps) => {
    return (
        <div className="wrap-price" onClick={() => setIsWrapPrice(!isWrapPrice)}>
            <p>
                1 {isWrapPrice ? "TIME" : "MEMO"} = {`1 ${isWrapPrice ? "MEMO" : "TIME"}`}
            </p>
        </div>
    );
};
