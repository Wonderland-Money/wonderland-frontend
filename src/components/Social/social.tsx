import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../assets/icons/github.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";

export default function SocialBar() {
    return (
        <div className="social-row">
            <Link href="https://github.com/0xMaaz/trident-frontend" target="_blank">
                <div className="social-link">
                    <SvgIcon component={GitHub} />
                    Github
                </div>
            </Link>

            <Link href="https://twitter.com/TridentDAO?s=20" target="_blank">
                <div className="social-link">
                    <SvgIcon component={Twitter} />
                    Twitter
                </div>
            </Link>

            <Link href="https://discord.gg/tridentdao" target="_blank">
                <div className="social-link">
                    <SvgIcon component={Discord} />
                    Discord
                </div>
            </Link>

            <Link href="https://tridentdao.gitbook.io/trident-dao/" target="_blank">
                <div className="social-link">
                    <SvgIcon color="primary" component={DocsIcon} />
                    Docs
                </div>
            </Link>
        </div>
    );
}
