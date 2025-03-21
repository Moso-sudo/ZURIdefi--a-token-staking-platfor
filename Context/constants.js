import { ethers } from "ethers";
import StakingDappABI from "./StakingDapp.json";
import TokenICO from "./TokenICO.json";
import CustomTokenABI from "./ERC20.json";

// CONTRACT ADDRESSES
const STAKING_DAPP_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const TOKEN_ICO = process.env.NEXT_PUBLIC_TOKEN_ICO;

// TOKEN ADDRESSES
const DEPOSIT_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN;

// Convert Amount to ETH
export function toEth(amount, decimals = 18) {
    return ethers.utils.formatUnits(amount, decimals).toString();
}

// Token Contract Instance
export const tokenContract = async () => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(DEPOSIT_TOKEN, CustomTokenABI.abi, signer);
    }
};

// Staking DApp Contract
export const contract = async () => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(STAKING_DAPP_ADDRESS, StakingDappABI.abi, signer);
    }
};

// Fetch ERC-20 Token Details
export const ERC20 = async (address, userAddress) => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractReader = new ethers.Contract(address, CustomTokenABI.abi, signer);

        return {
            name: await contractReader.name(),
            symbol: await contractReader.symbol(),
            address: contractReader.address,
            totalSupply: toEth(await contractReader.totalSupply()),
            balance: toEth(await contractReader.balanceOf(userAddress)),
            ContractTokenbalance: toEth(await contractReader.balanceOf(STAKING_DAPP_ADDRESS)),
        };
    }
};

// Load Token ICO Contract
export const LOAD_TOKEN_ICO = async () => {
    try {
        const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
        const contract = await TOKEN_ICO_CONTRACT();
        const tokenAddress = await contract.tokenAddress();

        if (tokenAddress !== ZERO_ADDRESS) {
            const tokenDetails = await contract.gettokenDetails();
            const contractOwner = await contract.owner();
            const soldTokens = await contract.soldTokens();
            const ICO_TOKEN = await TOKEN_ICO_ERC20();

            return {
                tokenBal: toEth(tokenDetails.balance),
                name: tokenDetails.name,
                symbol: tokenDetails.symbol,
                supply: toEth(tokenDetails.supply),
                tokenPrice: toEth(tokenDetails.tokenPrice),
                tokenAddr: tokenDetails.tokenAddr,
                owner: contractOwner.toLowerCase(),
                soldTokens: soldTokens.toNumber(),
                token: ICO_TOKEN,
            };
        }
    } catch (error) {
        console.error("LOAD_TOKEN_ICO Error:", error);
    }
};

// Token ICO Contract Instance
export const TOKEN_ICO_CONTRACT = async () => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(TOKEN_ICO, TokenICO.abi, signer);
    }
};

// Fetch Token ICO ERC-20 Details
export const TOKEN_ICO_ERC20 = async () => {
    try {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            const nativeBalance = await signer.getBalance();
            
            const contractReader = new ethers.Contract(DEPOSIT_TOKEN, CustomTokenABI.abi, signer);
            return {
                address: contractReader.address,
                name: await contractReader.name(),
                symbol: await contractReader.symbol(),
                decimals: await contractReader.decimals(),
                supply: toEth(await contractReader.totalSupply()),
                balance: toEth(await contractReader.balanceOf(userAddress)),
                nativeBalance: toEth(nativeBalance),
            };
        }
    } catch (error) {
        console.error("TOKEN_ICO_ERC20 Error:", error);
    }
};
