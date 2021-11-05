import { Dispatch } from "redux";
import { error } from "../store/slices/messages-slice";
import { messages } from "../constants/messages";

export const metamaskErrorWrap = (err: any, dispatch: Dispatch) => {
    let text = messages.something_wrong;

    if (err.code && err.code === -32603) {
        if (err.message.indexOf("ds-math-sub-underflow") >= 0) {
            text = "You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow";
        }

        if (err.data && err.data.message) {
            text = err.data.message.includes(":") ? err.data.message.split(":")[1].trim() : err.data.data || err.data.message;
        }

        if (err.data && err.data.message && err.data.message.includes("gas required exceeds allowance")) {
            text = "Insufficient balance to make a transaction";
        }

        if (err.data && err.data.message && err.data.message.includes("Bond too small")) {
            text = "Bond too small";
        }
    }

    if (err.code && err.code === 4001) {
        if (err.message.includes("User denied transaction signature")) {
            text = "User denied transaction signature";
        }
    }

    return dispatch(error({ text, error: err }));
};
