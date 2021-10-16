import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import orderBy from "lodash/orderBy";
import { IReduxState } from "../store/slices/state.interface";

export const makeBondsArray = (
  mimBondDiscount?: string | number,
  mimTimeBondDiscount?: string | number,
  avaxTimeBondDiscount?: string | number,
  wavaxBondDiscount?: string | number,
) => {
  return [
    {
      name: "MIM",
      value: "mim",
      discount: Number(mimBondDiscount),
    },
    {
      name: "TIME-AVAX LP",
      value: "avax_time_lp",
      discount: Number(avaxTimeBondDiscount),
    },
    {
      name: "TIME-MIM LP",
      value: "mim_time_lp",
      discount: Number(mimTimeBondDiscount),
    },
    {
      name: "wAVAX",
      value: "wavax",
      discount: Number(wavaxBondDiscount),
    },
  ];
};

const BONDS_ARRAY = makeBondsArray();

export const useBonds = () => {
  const mimBondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding["mim"] && state.bonding["mim"].bondDiscount;
  });

  const mimTimeDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding["mim_time_lp"] && state.bonding["mim_time_lp"].bondDiscount;
  });

  const avaxTimeDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding["avax_time_lp"] && state.bonding["avax_time_lp"].bondDiscount;
  });

  const wAvaxDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding["wavax"] && state.bonding["wavax"].bondDiscount;
  });

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(mimBondDiscount, mimTimeDiscount, avaxTimeDiscount, wAvaxDiscount);
    const mostProfitableBonds = orderBy(bondValues, "discount", "desc");
    setBonds(mostProfitableBonds);
  }, [mimBondDiscount, mimTimeDiscount, avaxTimeDiscount, wAvaxDiscount]);

  return bonds;
};
