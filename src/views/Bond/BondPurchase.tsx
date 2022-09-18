import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, OutlinedInput, InputAdornment, Slide, FormControl } from "@material-ui/core";
import { trim, prettifySeconds } from "../../helpers";
import { changeApproval, bondAsset, calcBondDetails, calcBondV2Details } from "../../store/slices/bond-slice";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAllBondData } from "../../hooks/bonds";
import useDebounce from "../../hooks/debounce";
import { messages } from "../../constants/messages";
import { warning } from "../../store/slices/messages-slice";
import Zapin from "./Zapin";
import { Networks } from "../../constants/blockchain";

interface IBondPurchaseProps {
    bond: IAllBondData;
    slippage: number;
}

function BondPurchase({ bond, slippage }: IBondPurchaseProps) {
    const dispatch = useDispatch();
    const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

    const [quantity, setQuantity] = useState("");
    const [useAvax, setUseAvax] = useState(false);

    const [showError, setShowError] = useState(false);

    const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
    const [zapinOpen, setZapinOpen] = useState(false);

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const vestingPeriod = () => {
        return prettifySeconds(bond.vestingTerm, "day");
    };

    async function onBond() {
        if (await checkWrongNetwork()) return;
        if (bond.deprecated || bond.soldOut) return;
        if (Number(quantity) > bond.maxBondPriceToken) return;
        if (quantity === "") {
            dispatch(warning({ text: messages.before_minting }));
            //@ts-ignore
        } else if (isNaN(quantity)) {
            dispatch(warning({ text: messages.before_minting }));
        } else if (bond.interestDue > 0 || bond.pendingPayout > 0) {
            const shouldProceed = window.confirm(messages.existing_mint);
            if (shouldProceed) {
                const trimBalance = trim(Number(quantity), 10);

                await dispatch(
                    bondAsset({
                        value: trimBalance,
                        slippage,
                        bond,
                        networkID: chainID,
                        provider,
                        address,
                        useAvax,
                    }),
                );
                clearInput();
            }
        } else {
            const trimBalance = trim(Number(quantity), 10);
            await dispatch(
                //@ts-ignore
                bondAsset({
                    value: trimBalance,
                    slippage,
                    bond,
                    networkID: chainID,
                    provider,
                    address,
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
        let amount: any = Math.min(bond.maxBondPriceToken * 0.9999, useAvax ? bond.avaxBalance * 0.99 : bond.balance);

        if (amount) {
            amount = trim(amount);
        }

        setQuantity((amount || "").toString());
    };

    const bondDetailsDebounce = useDebounce(quantity, 1000);

    useEffect(() => {
        if (bond.deprecated) return;
        if (bond.v2Bond) {
            dispatch(calcBondV2Details({ bond, value: quantity, provider, networkID: chainID }));
        } else {
            dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
        }

        setShowError(Number(quantity) > bond.maxBondPriceToken);
    }, [bondDetailsDebounce]);

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;

        dispatch(changeApproval({ address, bond, provider, networkID: chainID }));
    };

    const handleZapinOpen = () => {
        dispatch(calcBondDetails({ bond, value: "0", provider, networkID: chainID }));
        setZapinOpen(true);
    };

    const handleZapinClose = () => {
        dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
        setZapinOpen(false);
    };

    const displayUnits = useAvax ? "AVAX" : bond.displayUnits;

    const isShowZap = bond.disableZap ? false : !bond.deprecated;

    const displeyToken = chainID === Networks.AVAX ? "TIME" : "wMEMO";

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
                    {showError && (
                        <div className="bond-input-error">
                            <p>The value cannot be greater than {trim(bond.maxBondPriceToken, 8)}</p>
                        </div>
                    )}
                </FormControl>
                {hasAllowance() || useAvax ? (
                    <div
                        className="transaction-button bond-approve-btn"
                        onClick={async () => {
                            if (bond.deprecated) {
                                return;
                            }
                            if (isPendingTxn(pendingTransactions, "bond_" + bond.name)) return;
                            await onBond();
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "bond_" + bond.name, bond.deprecated ? "Deprecated" : chainID === Networks.AVAX ? "Mint" : "Buy wMEMO")}</p>
                    </div>
                ) : (
                    <div
                        className="transaction-button bond-approve-btn"
                        onClick={async () => {
                            if (bond.deprecated) {
                                return;
                            }
                            if (isPendingTxn(pendingTransactions, "approve_" + bond.name)) return;
                            await onSeekApproval();
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "approve_" + bond.name, bond.deprecated ? "Deprecated" : "Approve")}</p>
                    </div>
                )}

                {isShowZap && (
                    <div className="transaction-button bond-approve-btn" onClick={handleZapinOpen}>
                        <p>Zap</p>
                    </div>
                )}

                {!hasAllowance() && !useAvax && (
                    <div className="help-text">
                        {chainID === Networks.AVAX ? (
                            <p className="help-text-desc">
                                Note: The "Approve" transaction is only needed when minting for the first time; subsequent minting only requires you to perform the "Mint"
                                transaction.
                            </p>
                        ) : (
                            <p className="help-text-desc">
                                Note: The "Approve" transaction is only needed when Wmemo purchasing for the first time; subsequent purchases only requires you to perform the
                                purchase transaction
                            </p>
                        )}
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
                        <p className="price-data bond-balance-title">
                            {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondQuote, bond.v2Bond ? 8 : 4)} ${displeyToken}`}
                        </p>
                    </div>

                    {chainID === Networks.AVAX && (
                        <div className="data-row">
                            <p className="bond-balance-title grey">You Will Get</p>
                            <p className="price-data bond-balance-title grey">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondQuoteWrapped, 8)} wMEMO`}</p>
                        </div>
                    )}

                    <div className={`data-row`}>
                        <p className="bond-balance-title">Max You Can Buy</p>
                        <p className="price-data bond-balance-title">
                            {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.maxBondPrice, bond.v2Bond ? 8 : 4)} ${displeyToken}`}
                        </p>
                    </div>

                    {chainID === Networks.AVAX && (
                        <div className="data-row">
                            <p className="bond-balance-title grey">Max You Can Buy</p>
                            <p className="price-data bond-balance-title grey">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.maxBondPriceWrapped, 8)} wMEMO`}</p>
                        </div>
                    )}

                    <div className="data-row">
                        <p className="bond-balance-title">ROI</p>
                        <p className="bond-balance-title">
                            {isBondLoading ? <Skeleton width="100px" /> : bond.soldOut ? "Sold out" : `${trim(bond.deprecated ? 0 : bond.bondDiscount * 100, 2)}%`}
                        </p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">Vesting Term</p>
                        <p className="bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">Minimum purchase</p>
                        <p className="bond-balance-title">
                            {bond.v2Bond ? "0.0001" : "0.01"} {displeyToken}
                        </p>
                    </div>
                </Box>
            </Slide>
            {isShowZap && <Zapin open={zapinOpen} handleClose={handleZapinClose} bond={bond} />}
        </Box>
    );
}

export default BondPurchase;
