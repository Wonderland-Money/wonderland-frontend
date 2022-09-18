import { useEffect } from "react";
import { History } from "history";
import { Networks, VIEWS_FOR_NETWORK } from "../constants";

/**
 * will redirect from paths that aren't active on a given network yet.
 */
export function usePathForNetwork({ pathName, networkID, history }: { pathName: string; networkID: Networks; history: History }) {
    const handlePathForNetwork = () => {
        switch (pathName) {
            case "stake":
                if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].stake) {
                    break;
                } else {
                    history.push("/dashboard");
                    break;
                }
            case "mints":
                if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].mints) {
                    break;
                } else {
                    history.push("/dashboard");
                    break;
                }
            case "dashboard":
                if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].dashboard) {
                    break;
                } else {
                    history.push("/dashboard");
                    break;
                }
            case "calculator":
                if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].calculator) {
                    break;
                } else {
                    history.push("/dashboard");
                    break;
                }
            case "fund":
                if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].fund) {
                    break;
                } else {
                    history.push("/dashboard");
                    break;
                }
            case "redemption":
                if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].redemption) {
                    break;
                } else {
                    history.push("/dashboard");
                    break;
                }
            case "farm":
                if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].farm) {
                    break;
                } else {
                    history.push("/dashboard");
                    break;
                }
            default:
                console.log("pathForNetwork ok");
        }
    };

    useEffect(() => {
        handlePathForNetwork();
    }, [networkID]);
}
