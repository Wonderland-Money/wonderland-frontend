import { BigNumber, Contract } from "ethers";

export async function earned(rewardsToken: string, balance: BigNumber, currentRewardPerToken: BigNumber, farmContract: Contract): Promise<BigNumber> {
    const { rewardPerTokenStored } = await farmContract.rewardData(rewardsToken);

    return balance.mul(currentRewardPerToken.sub(rewardPerTokenStored)).div("1000000000000000000");
}
