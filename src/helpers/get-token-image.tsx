import BlockImg from "../assets/tokens/blocks.png";
import zBlockImg from "../assets/tokens/zblocks.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "block") {
        return toUrl(BlockImg);
    }

    if (name === "zblock") {
        return toUrl(zBlockImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
