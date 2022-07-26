import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../../assets/icons/github.svg";
import { ReactComponent as Twitter } from "../../../assets/icons/twitter.svg";
import { ReactComponent as Telegram } from "../../../assets/icons/telegram.svg";
import { ReactComponent as Discord } from "../../../assets/icons/discord.svg";

export default function Social() {
    return (
        <div className="social-row">
            <Link href="https://github.com/Mclaren-Benz/wonderland-frontend" target="_blank">
                <SvgIcon color="primary" component={GitHub} />
            </Link>

            <Link href="https://twitter.com/jambestwick" target="_blank">
                <SvgIcon color="primary" component={Twitter} />
            </Link>

            <Link href="https://t.me/joinchat/6UybL5rJMEhjN2Y5" target="_blank">
                <SvgIcon viewBox="0 0 32 32" color="primary" component={Telegram} />
            </Link>

            <Link href="https://discord.gg/AjkMXS7U" target="_blank">
                <SvgIcon color="primary" component={Discord} />
            </Link>
        </div>
    );
}
