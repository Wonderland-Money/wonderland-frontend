import React from "react";
import "./background.scss";
import BlobsTop from "../../../../assets/icons/landing-blobs-top.png";
import BlobsCenter from "../../../../assets/icons/landing-blobs-center.png";

function Background() {
    return (
        <div className="landing-background">
            <div className="landing-background-blobs-top">
                <img alt="" src={BlobsTop} />
            </div>
        </div>
    );
}

export default Background;
