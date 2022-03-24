import { IPendingTxn } from "./pending-txns-slice";
import { IAccountSlice } from "./account-slice";
import { IAppSlice } from "./app-slice";
import { IBondSlice } from "./bond-slice";
import { IPresaleOneSlice } from "./presale-one-slice";
import { IPresaleTwoSlice } from "./presale-two-slice";
import { IPresaleThreeSlice } from "./presale-three-slice";
import { IPresaleFourSlice } from "./presale-four-slice";
import { MessagesState } from "./messages-slice";

export interface IReduxState {
    pendingTransactions: IPendingTxn[];
    account: IAccountSlice;
    app: IAppSlice;
    bonding: IBondSlice;
    messages: MessagesState;
    presaleOne: IPresaleOneSlice;
    presaleTwo: IPresaleTwoSlice;
    presaleThree: IPresaleThreeSlice;
    presaleFour: IPresaleFourSlice;
}
