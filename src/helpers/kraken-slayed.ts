import { ethers } from "ethers";
import { KrakenSlayersContract } from "src/abi";
import { getAddresses } from "src/constants";
import { Networks } from "src/constants/blockchain";
import variables from "../views/Phaser/managers/Variables";
const request = require("request");

export const krakenSlayed = async (provider: any, address: any) => {
    const message = "Take your place among Atlantis' finest. Sign this message to confirm your address & create your account with Trident.";
    let signedMessage = "";
    try {
        const signer = provider.getSigner();
        signedMessage = await signer.signMessage(message);
    } catch (error) {
        console.error(error);
    }

    const options = {
        url: "https://enigmatic-dawn-71860.herokuapp.com/finish",
        json: true,
        body: {
            message: message,
            signed: signedMessage,
        },
    };

    await request.post(options, (err: any, res: any, body: any) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode == 200) {
            checkAfterSign(provider, address);
        }
        console.log(body);
    });
};

export const checkKrakenSlayed = async (provider: any, address: any) => {
    const addresses = getAddresses(Networks.ONE);
    const krakenContract = new ethers.Contract(addresses.krakenSlayers, KrakenSlayersContract, provider);
    const isWinner = await krakenContract.passedGame(address);
    if (isWinner) {
        variables.gameState.accountIsGoatedWithTheSauce = true;
    }
};

async function checkAfterSign(provider: any, address: any) {
    const addresses = getAddresses(Networks.ONE);

    let check = false;
    while (!check) {
        const krakenContract = new ethers.Contract(addresses.krakenSlayers, KrakenSlayersContract, provider);
        const isWinner = await krakenContract.passedGame(address);

        if (isWinner) {
            variables.gameState.accountIsGoatedWithTheSauce = true;
            check = true;
        }

        await new Promise(f => setTimeout(f, 5000));
    }
}
