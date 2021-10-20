import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, OutlinedInput, InputAdornment, Slide, FormControl } from "@material-ui/core";
import { shorten, trim, prettifySeconds } from "../../helpers";
import { changeApproval, bondAsset, calcBondDetails } from "../../store/slices/bond-slice";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAllBondData } from "../../hooks/bonds";
import useDebounce from "../../hooks/debounce";
import { messages } from "../../constants/messages";
import { warning } from "../../store/slices/messages-slice";

interface IBondPurchaseProps {
    bond: IAllBondData;
    slippage: number;
    recipientAddress: string;
}

function BondPurchase({ bond, slippage, recipientAddress }: IBondPurchaseProps) {
    const SECONDS_TO_REFRESH = 60;
    const dispatch = useDispatch();
    const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

    const [quantity, setQuantity] = useState("");
    const [useAvax, setUseAvax] = useState(false);
    const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

    const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const vestingPeriod = () => {
        return prettifySeconds(bond.vestingTerm, "day");
    };

    async function onBond() {
        if (await checkWrongNetwork()) return;

        if (quantity === "") {
            dispatch(warning({ text: messages.before_minting }));
            //@ts-ignore
        } else if (isNaN(quantity)) {
            dispatch(warning({ text: messages.before_minting }));
        } else if (bond.interestDue > 0 || bond.pendingPayout > 0) {
            const shouldProceed = window.confirm(messages.existing_mint);
            if (shouldProceed) {
                const trimBalance = trim(Number(trim(Number(quantity), 10)) - 1 * Math.pow(10, -10));

                await dispatch(
                    bondAsset({
                        value: trimBalance,
                        slippage,
                        bond,
                        networkID: chainID,
                        provider,
                        address: recipientAddress || address,
                        useAvax,
                    }),
                );
                clearInput();
            }
        } else {
            const trimBalance = trim(Number(trim(Number(quantity), 10)) - 1 * Math.pow(10, -10));
            await dispatch(
                //@ts-ignore
                bondAsset({
                    value: trimBalance,
                    slippage,
                    bond,
                    networkID: chainID,
                    provider,
                    address: recipientAddress || address,
                    useAvax,
                }),
            );
            clearInput();
        }
    }

    const clearInput = () => {
        setQuantity("");
    };

    const hasAllowance = useCallback(() => {
        return bond.allowance > 0;
    }, [bond.allowance]);

    const setMax = () => {
        const amount = Math.min(bond.maxBondPriceToken, useAvax ? bond.avaxBalance * 0.99 : bond.balance);
        setQuantity((amount || "").toString());
    };

    const bondDetailsDebounce = useDebounce(quantity, 1000);

    useEffect(() => {
        dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
    }, [bondDetailsDebounce]);

    useEffect(() => {
        let interval: any = null;
        if (secondsToRefresh > 0) {
            interval = setInterval(() => {
                setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
            }, 1000);
        } else {
            clearInterval(interval);
            dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
            setSecondsToRefresh(SECONDS_TO_REFRESH);
        }
        return () => clearInterval(interval);
    }, [secondsToRefresh, quantity]);

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;

        dispatch(changeApproval({ address, bond, provider, networkID: chainID }));
    };

    const displayUnits = useAvax ? "AVAX" : bond.displayUnits;

    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                {bond.name === "wavax" && (
                    <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
                        <div className="avax-checkbox">
                            <input type="checkbox" checked={useAvax} onClick={() => setUseAvax(!useAvax)} />
                            <p>Use AVAX</p>
                        </div>
                    </FormControl>
                )}
                <FormControl className="bond-input-wrap" variant="outlined" color="primary" fullWidth>
                    <OutlinedInput
                        placeholder="Amount"
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        labelWidth={0}
                        className="bond-input"
                        endAdornment={
                            <InputAdornment position="end">
                                <div className="stake-input-btn" onClick={setMax}>
                                    <p>Max</p>
                                </div>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                {hasAllowance() || useAvax ? (
                    <div
                        className="transaction-button bond-approve-btn"
                        onClick={async () => {
                            if (isPendingTxn(pendingTransactions, "bond_" + bond.name)) return;
                            await onBond();
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "bond_" + bond.name, "Mint")}</p>
                    </div>
                ) : (
                    <div
                        className="transaction-button bond-approve-btn"
                        onClick={async () => {
                            if (isPendingTxn(pendingTransactions, "approve_" + bond.name)) return;
                            await onSeekApproval();
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "approve_" + bond.name, "Approve")}</p>
                    </div>
                )}

                {!hasAllowance() && !useAvax && (
                    <div className="help-text">
                        <p className="help-text-desc">
                            Note: The "Approve" transaction is only needed when minting for the first time; subsequent minting only requires you to perform the "Mint" transaction.
                        </p>
                    </div>
                )}
            </Box>

            <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
                <Box className="bond-data">
                    <div className="data-row">
                        <p className="bond-balance-title">Your Balance</p>
                        <p className="bond-balance-title">
                            {isBondLoading ? (
                                <Skeleton width="100px" />
                            ) : (
                                <>
                                    {trim(useAvax ? bond.avaxBalance : bond.balance, 4)} {displayUnits}
                                </>
                            )}
                        </p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">You Will Get</p>
                        <p className="price-data bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondQuote, 4)} TIME`}</p>
                    </div>

                    <div className={`data-row`}>
                        <p className="bond-balance-title">Max You Can Buy</p>
                        <p className="price-data bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.maxBondPrice, 4)} TIME`}</p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">ROI</p>
                        <p className="bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondDiscount * 100, 2)}%`}</p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">Debt Ratio</p>
                        <p className="bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.debtRatio, 2)}%`}</p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">Vesting Term</p>
                        <p className="bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">Minimum purchase</p>
                        <p className="bond-balance-title">0.01 TIME</p>
                    </div>

                    {recipientAddress !== address && (
                        <div className="data-row">
                            <p className="bond-balance-title">Recipient</p>
                            <p className="bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : shorten(recipientAddress)}</p>
                        </div>
                    )}
                </Box>
            </Slide>
        </Box>
    );
}

export default BondPurchase;
