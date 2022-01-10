import React from "react";
import "./landing.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";

function Landing() {
    return (
        <div className="landing-root">
            <Header />
            <Main />
            <Footer />
        </div>
    );
}
export default Landing;
