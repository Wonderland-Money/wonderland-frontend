import { Zoom } from "@material-ui/core";
import "./fund.scss";
import Accordion from "./components/Accordion";
import WalletIcon from "../../assets/icons/wallet.svg";
import VaultIcon from "../../assets/icons/vault.svg";
//import LeveragedPositionsIcon from "../../assets/icons/leveraged-positions.svg";
import LiquidityPoolsIcon from "../../assets/icons/liquidity-pools.svg";
import NetworkIcon from "../../assets/icons/networks.svg";
import ProtocolsIcon from "../../assets/icons/protocols.svg";
import { useDataSource } from "../../hooks/useData";
import ClaimableIcon from "../../assets/icons/claimable.svg";
//import DeptIcon from "../../assets/icons/dept.svg";
import FarmIcon from "../../assets/icons/farm.svg";
import Header from "./components/Header";
import { usePathForNetwork, useWeb3Context } from "../../hooks";
import { useHistory } from "react-router-dom";
import { IReduxState } from "src/store/slices/state.interface";
import { IZapperData } from "src/store/slices/app-slice";
import { useSelector } from "react-redux";

function Fund() {
    const history = useHistory();
    const { chainID } = useWeb3Context();
    usePathForNetwork({ pathName: "fund", networkID: chainID, history });

    const zapper = useSelector<IReduxState, IZapperData>(state => {
        return state.app.zapper;
    });

    const data = useDataSource(zapper);
    return (
        <div className="fund-view">
            <Zoom in={true}>
                <div className="fund-infos">
                    <Header data={data} />
                    {data.wallet && <Accordion icon={WalletIcon} title="Wallet" data={data.wallet} />}
                    {data.vaults && <Accordion icon={VaultIcon} title="Vaults" data={data.vaults} />}
                    {/* {data.leveragedPosition && <Accordion icon={LeveragedPositionsIcon} title="Leveraged position" data={data.leveragedPosition} />} */}
                    {data.liquidityPool && <Accordion icon={LiquidityPoolsIcon} title="Liquidity Pools" data={data.liquidityPool} />}
                    {data.claimable && <Accordion icon={ClaimableIcon} title="Claimable" data={data.claimable} />}
                    {data.farm && <Accordion icon={FarmIcon} title="Farm" data={data.farm} />}
                    {/* {data.debt && <Accordion icon={DeptIcon} title="Debt" data={data.debt} />} */}
                    {data.networks && <Accordion icon={NetworkIcon} title="Networks" data={data.networks} />}
                    {data.protocols && <Accordion icon={ProtocolsIcon} title="Protocols" data={data.protocols} />}
                </div>
            </Zoom>
        </div>
    );
}

export default Fund;
