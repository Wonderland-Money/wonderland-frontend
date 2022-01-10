import React, { useEffect, useState } from "react";
import App from "./App";
import Landing from "./Landing";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { loadTokenPrices } from "../helpers";
import Loading from "../components/Loader";

function Root() {
    // const isApp = (): boolean => {
    //     return true; //window.location.host.includes("app");
    // };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTokenPrices().then(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    const app = () => (
        <Router>
            <Switch>
                <Route path="/home" component={Landing} />
                <Route path="/dash" component={App} />
                <Redirect to="/home" />
            </Switch>
        </Router>
    );

    // return isApp() ? app() : <Landing />;
    return app();
}

export default Root;
