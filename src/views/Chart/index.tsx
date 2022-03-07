import { Zoom } from "@material-ui/core";
import "./chart.scss";

const src = "https://dexscreener.com/ethereum/0x055475920a8c93cffb64d039a8205f7acc7722d3";

function Chart() {
    return (
        <div className="chart-view">
            <Zoom in={true}>
                <div className="chart-card">
                    <iframe src={src} height="100%" width="100%"></iframe>
                </div>
            </Zoom>
        </div>
    );
}

export default Chart;
