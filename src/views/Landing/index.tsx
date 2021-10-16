import React from "react";
import "./landing.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Link } from "@material-ui/core";

function Landing() {
  return (
    <div className="landing-root">
      <Header />
      <div className="landing-main">
        <div className="landing-main-title-wrap">
          <p>The Decentralized</p>
          <p>Wonderland</p>
        </div>
        <div className="landing-main-help-text-wrap">
          <p>Financial tools to grow your wealth - stake and earn</p>
          <p>compounding interest on the Avalanche Network</p>
        </div>
        <div className="landing-main-btns-wrap">
          <Link href="https://app.wonderland.money" target="_blank" rel="noreferrer">
            <div className="landing-main-btn">
              <p>Enter App</p>
            </div>
          </Link>
          <Link href="https://wonderland.gitbook.io/wonderland/" target="_blank" rel="noreferrer">
            <div className="landing-main-btn">
              <p>Documentation</p>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Landing;
