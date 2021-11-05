import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allTokens from "../helpers/tokens";
import { IUserTokenDetails } from "../store/slices/account-slice";
import { IReduxState } from "../store/slices/state.interface";
import { IToken } from "../helpers/tokens";

// Smash all the interfaces together to get the BondData Type
export interface IAllTokenData extends IToken, IUserTokenDetails {}

const initialTokenArray = allTokens;

function useTokens() {
    const accountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);
    const accountTokensState = useSelector<IReduxState, { [key: string]: IUserTokenDetails }>(state => state.account.tokens);
    //@ts-ignore
    const [tokens, setTokens] = useState<IAllTokenData[]>(initialTokenArray);

    useEffect(() => {
        let tokenDetails: IAllTokenData[];
        //@ts-ignore
        tokenDetails = allTokens.flatMap(token => {
            if (accountTokensState[token.name]) {
                return Object.assign(token, accountTokensState[token.name]);
            }
            return token;
        });

        const mostProfitableBonds = tokenDetails.concat().sort((a, b) => {
            return a["balance"] > b["balance"] ? -1 : b["balance"] > a["balance"] ? 1 : 0;
        });

        setTokens(mostProfitableBonds);
    }, [accountTokensState, accountLoading]);

    return { tokens, loading: accountLoading };
}

export default useTokens;
