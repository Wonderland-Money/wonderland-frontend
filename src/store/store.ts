import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "./slices/account-slice";
import bondingReducer from "./slices/bond-slice";
import presaleOneReducer from "./slices/presale-one-slice";
import presaleTwoReducer from "./slices/presale-two-slice";
import presaleThreeReducer from "./slices/presale-three-slice";
import presaleFourReducer from "./slices/presale-four-slice";
import appReducer from "./slices/app-slice";
import pendingTransactionsReducer from "./slices/pending-txns-slice";
import messagesReducer from "./slices/messages-slice";

const store = configureStore({
    reducer: {
        account: accountReducer,
        bonding: bondingReducer,
        presaleOne: presaleOneReducer,
        presaleTwo: presaleTwoReducer,
        presaleThree: presaleThreeReducer,
        presaleFour: presaleFourReducer,
        app: appReducer,
        pendingTransactions: pendingTransactionsReducer,
        messages: messagesReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
