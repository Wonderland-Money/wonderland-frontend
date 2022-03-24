import React, { useEffect, useState } from "react";
import App from "./App";
import Landing from "./Landing";
import { HashRouter, Route, Switch } from "react-router-dom";
import { loadTokenPrices } from "../helpers";
import Loading from "../components/Loader";
import Mobile from "../components/Mobile";

import { useMediaQuery } from "@material-ui/core";

function Root() {
    const [loading, setLoading] = useState(true);

    const isMobileDevice = useMediaQuery("(max-width: 960px)");

    useEffect(() => {
        loadTokenPrices().then(() => setLoading(false));
    }, []);

    // To be used until mobile version is developed
    if (isMobileDevice) return <Mobile />;

    if (loading) return <Loading />;

    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={Landing}></Route>
                <Route component={App} />
            </Switch>
        </HashRouter>
    );
}

export default Root;
