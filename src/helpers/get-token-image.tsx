import PsiImg from "../assets/tokens/PSI.svg";
import SpsiImg from "../assets/tokens/PSI.svg";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "psi") {
        return toUrl(PsiImg);
    }

    if (name === "spsi") {
        return toUrl(SpsiImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
