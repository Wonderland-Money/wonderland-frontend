import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as Twitter } from "../../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../../assets/icons/discord.svg";
import { ReactComponent as GitBook } from "../../../assets/icons/gitBook.svg";
import { ReactComponent as MIcon } from "../../../assets/icons/mIcon.svg";

export default function Social() {
    return (
        <div className="social-row">
            <Link href="https://twitter.com/cwdao?s=21" target="_blank">
                <SvgIcon color="primary" component={Twitter} />
            </Link>
            <Link href="https://discord.com/invite/mEWNuz55a7" target="_blank">
                <SvgIcon color="primary" component={Discord} />
            </Link>
            <Link href="https://t.me/joinchat/6UybL5rJMEhjN2Y5" target="_blank">
                <SvgIcon color="primary" component={MIcon} />
            </Link>
            <Link href="https://commonwealthdao.gitbook.io/docs/welcome-to-commonwealth/foundation" target="_blank">
                <SvgIcon color="primary" component={GitBook} />
            </Link>
        </div>
    );
}
