import React, { useState } from "react";
import "./accordion.scss";
import AnimateHeight from "react-animate-height";
import { IData } from "src/hooks/types";
import TabPanel from "../../../../components/TabPanel";
import Chart from "./components/Chart";
import Header from "./components/Header";
import CardsList from "./components/CardsList";

interface IAccordion {
    title: string;
    icon?: string;
    data: IData[];
}

function Accordion({ title, icon, data }: IAccordion) {
    const [open, setOpen] = useState(false);
    const [viewChart, setViewChart] = useState(true);

    const handleSwitchChange = () => setViewChart(!viewChart);

    const handle = (e: any) => {
        const className = e.target.getAttribute("class");
        if (className && className.includes("MuiSwitch-input")) return;
        setOpen(!open);
    };

    const total: number = data.map(({ balanceUsd }) => balanceUsd).reduce((a, b) => a + b, 0);

    return (
        <div className="accordion-root">
            <Header title={title} icon={icon} handle={handle} total={total} viewChart={viewChart} handleSwitchChange={handleSwitchChange} />
            <AnimateHeight duration={500} height={open ? "auto" : 0}>
                <div className="accordion-body">
                    <TabPanel value={viewChart} index={true}>
                        <Chart data={data} total={total} />
                    </TabPanel>
                    <TabPanel value={viewChart} index={false}>
                        <CardsList data={data} />
                    </TabPanel>
                </div>
            </AnimateHeight>
        </div>
    );
}

export default Accordion;
