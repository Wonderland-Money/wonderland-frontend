import React, { useEffect, useState } from "react";
import App from "./App";
import Landing from "./Landing";
import { HashRouter, Route, Switch } from "react-router-dom";
import { loadTokenPrices } from "../helpers";
import Loading from "../components/Loader";

function Root() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTokenPrices().then(() => setLoading(false));
    }, []);

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
