import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAddress, useWeb3Context } from "../hooks";
import { loadAppDetails } from "../store/slices/app-slice";
import Landing from "../views/Landing";
import "./style.scss";

function App() {
    const dispatch = useDispatch();
    const address = useAddress();

    const { provider, chainID, connected } = useWeb3Context();

    const loadApp = useCallback(
        loadProvider => {
            dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider, address }));
        },
        [connected],
    );

    useEffect(() => {
        loadApp(provider);
    }, []);

    return <Landing />;
}

export default App;
