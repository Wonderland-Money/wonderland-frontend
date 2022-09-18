import React, { useState } from "react";
import "./accordion.scss";
import ArrowDown from "../../assets/icons/arrow-down.svg";
import classNames from "classnames";
import AnimateHeight from "react-animate-height";

interface AccordionProps {
    title: string;
    children: React.ReactElement<any, any>;
}

function Accordion({ title, children }: AccordionProps) {
    const [open, setOpen] = useState(true);

    const handle = () => {
        setOpen(!open);
    };

    return (
        <div className="accordion-component-root">
            <div onClick={handle} className="accordion-component-header">
                <p className="accordion-component-header-title">{title}</p>
                <div className={classNames("accordion-component-btf", { "accordion-component-btf-active": open })}>
                    <img alt="" src={ArrowDown} />
                </div>
            </div>
            <AnimateHeight duration={500} height={open ? "auto" : 0}>
                <div className="accordion-component-body">{children}</div>
            </AnimateHeight>
        </div>
    );
}

export default Accordion;
