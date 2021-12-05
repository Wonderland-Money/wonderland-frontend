import TimeImg from "../assets/tokens/TIME.svg";
import MemoImg from "../assets/tokens/MEMO.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "amp") {
        return toUrl(TimeImg);
    }

    if (name === "samp") {
        return toUrl(MemoImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
