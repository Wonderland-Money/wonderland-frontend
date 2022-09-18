import { Switch } from "@material-ui/core";
import ArrowDown from "../../../../../../assets/icons/arrow-down.svg";
import classNames from "classnames";

interface IHeader {
    title: string;
    icon?: string;
    handle: (e: any) => void;
    total: number;
    viewChart: boolean;
    handleSwitchChange: () => void;
}

function Header({ title, icon, handle, total, viewChart, handleSwitchChange }: IHeader) {
    return (
        <div onClick={handle} className="accordion-header">
            {icon && (
                <div className="accordion-header-icon-wrap">
                    <img alt="" src={icon} />
                </div>
            )}
            <div className="accordion-header-title-wrap">
                <p className="accordion-header-title">{title}</p>
                <p className="accordion-header-value">
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                    }).format(total)}
                </p>
            </div>
            <div className="accordion-nav-wrap">
                <div className="accordion-chart-btn-wrap">
                    <p className="accordion-chart-btn-text">Chart view</p>
                    <Switch color="primary" checked={viewChart} onChange={handleSwitchChange} />
                </div>
                <div className={classNames("accordion-btf", { "accordion-btf-active": open })}>
                    <img alt="" src={ArrowDown} />
                </div>
            </div>
        </div>
    );
}

export default Header;
