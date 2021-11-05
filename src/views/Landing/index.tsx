import React from "react";
import "./landing.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Background from "./components/Background";

function Landing() {
    return (
        <div className="landing-root">
            <Header />
            <Main />
            <Footer />
            <Background />
        </div>
    );
}

export default Landing;
