import React from "react";
import "./footer.scss";
import Social from "../../../../components/Drawer/drawer-content/social";
function Footer() {
    return (
        <div className="landing-footer">
            <div className="landing-footer-item-wrap">
                <div className="landing-footer-item-title footer-hidden">Copyright © Common Wealth DAO. All rights reserved.</div>
                <Social />
                <div className="landing-footer-item-title footer-shown">Copyright © Common Wealth DAO. All rights reserved.</div>
            </div>
        </div>
    );
}

export default Footer;
