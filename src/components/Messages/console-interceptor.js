import { error } from "../../store/slices/messages-slice";
import store from "../../store/store";
import { messages } from "../../constants/messages";

// List of error messages we wish to intercept
const interceptedConsoleMessages = ["Wrong network, please switch to mainnet"];

// Intercepts an error sent to console and dispatches it to the message framework.
var consoleInterceptor = function (message) {
    if (interceptedConsoleMessages.includes(message)) {
        store.dispatch(error({ text: messages.something_wrong, error: message }));
    }
    console._error_old(message);
};
consoleInterceptor.isInterceptor = true;

// Replaces the console.error function by our interceptor
if (console.error.isInterceptor != true) {
    console._error_old = console.error;
    console.error = consoleInterceptor;
}
