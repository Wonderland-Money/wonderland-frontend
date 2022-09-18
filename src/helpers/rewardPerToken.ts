import { BigNumber, Contract } from "ethers";

export async function rewardPerToken(rewardsToken: string, farmContract: Contract): Promise<BigNumber> {
    const totalSupply = await farmContract.totalSupply();
    const { rewardPerTokenStored, rewardRate } = await farmContract.rewardData(rewardsToken);

    if (totalSupply.eq(0)) {
        return rewardPerTokenStored;
    }

    return rewardPerTokenStored.add(BigNumber.from("86400").mul(rewardRate).mul("1000000000000000000").div(totalSupply));
}
