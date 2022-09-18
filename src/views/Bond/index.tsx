import { useState } from "react";
import { useSelector } from "react-redux";
import { trim } from "../../helpers";
import { Grid, Backdrop, Box, Fade } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import BondHeader from "./BondHeader";
import BondRedeem from "./BondRedeem";
import BondPurchase from "./BondPurchase";
import "./bond.scss";
import { usePathForNetwork, useWeb3Context } from "../../hooks";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAllBondData } from "../../hooks/bonds";
import classnames from "classnames";
import { wavax, weth } from "../../helpers/bond";
import { useHistory } from "react-router-dom";
import { Networks } from "../../constants/blockchain";

interface IBondProps {
    bond: IAllBondData;
}

function Bond({ bond }: IBondProps) {
    const history = useHistory();
    const { chainID } = useWeb3Context();

    usePathForNetwork({ pathName: "mints", networkID: chainID, history });

    const [slippage, setSlippage] = useState(0.5);

    const [view, setView] = useState(0);

    const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);

    const onSlippageChange = (value: any) => {
        return setSlippage(value);
    };

    const changeView = (newView: number) => () => {
        setView(newView);
    };

    const wmemoPrice = useSelector<IReduxState, number>(state => {
        return state.app.wMemoMarketPrice;
    });

    return (
        <Fade in={true} mountOnEnter unmountOnExit>
            <Grid className="bond-view">
                <Backdrop open={true}>
                    <Fade in={true}>
                        <div className="bond-card">
                            <BondHeader bond={bond} slippage={slippage} onSlippageChange={onSlippageChange} />
                            {/* @ts-ignore */}
                            <Box direction="row" className="bond-price-data-row">
                                <div className="bond-price-data">
                                    <p className="bond-price-data-title">{chainID === Networks.AVAX ? "Mint Price" : "Treasury sale price"}</p>
                                    <p className="bond-price-data-value">
                                        {isBondLoading ? (
                                            <Skeleton />
                                        ) : bond.isLP || bond.name === wavax.name || bond.name === weth.name ? (
                                            `$${trim(bond.deprecated ? 0 : bond.bondPrice, 2)}`
                                        ) : (
                                            `${trim(bond.deprecated ? 0 : bond.bondPrice, 2)} MIM`
                                        )}
                                    </p>
                                </div>
                                {chainID === Networks.AVAX && (
                                    <div className="bond-price-data">
                                        <p className="bond-price-data-title">wMEMO Price</p>
                                        <p className="bond-price-data-value">{isBondLoading ? <Skeleton /> : `$${trim(wmemoPrice, 2)}`}</p>
                                    </div>
                                )}
                                <div className="bond-price-data">
                                    <p className="bond-price-data-title">{chainID === Networks.AVAX ? "TIME Price" : "wMEMO Price"}</p>
                                    <p className="bond-price-data-value">{isBondLoading ? <Skeleton /> : `$${trim(bond.marketPrice, 2)}`}</p>
                                </div>
                            </Box>

                            <div className="bond-one-table">
                                <div className={classnames("bond-one-table-btn", { active: !view })} onClick={changeView(0)}>
                                    <p>{chainID === Networks.AVAX ? "Mint" : "Treasury sales"}</p>
                                </div>
                                <div className={classnames("bond-one-table-btn", { active: view })} onClick={changeView(1)}>
                                    <p>Redeem</p>
                                </div>
                            </div>

                            <TabPanel value={view} index={0}>
                                <BondPurchase bond={bond} slippage={slippage} />
                            </TabPanel>

                            <TabPanel value={view} index={1}>
                                <BondRedeem bond={bond} />
                            </TabPanel>
                        </div>
                    </Fade>
                </Backdrop>
            </Grid>
        </Fade>
    );
}

export default Bond;
