import {BigNumber, ethers} from "ethers";
import  toast from "react-hot-toast";
import {
    contract,
    tokenContract,
    ERC20,
    toEth,
    TOKEN_ICO_CONTRACT,
} from "./constants";

const STAKING_DAPP_ADDRESS = process.env.STAKING_DAPP;
const DEPOSIT_TOKEN= process.env.DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.REWARD_TOKEN;
const TOKEN_LOGO = process.env.TOKEN_LOGO;

const notifySuccess = (msg) => toast.success(msg, {duration:2000});
const notifyError = (msg)=> toast.error(msg, {duration: 2000});

//FUNCTIONS
function CONVERT_TIMESTAMP_TO_READABLE(timestamp){

const date = new Date (timestamp * 1000);

const readableTime = date.toLocaleDateString("en-US",{
    year: "numeric",
    month : "2-digit",
    day: "2-digit",
    hour : "2-digit",
    minute : "2-digit",
    second : "2-digit",


});
return readableTime;
}

function toWei(amount){
    const toWei = ethers.utils.parseUnits(amount.toString());
    return toWei.toString();

}


function parseErrorMsg(e){
    const json = JSON.parse(JSON.stringify(e));
    return json?.reason || json?.error?.message;
}
export const SHORTEN_ADDRESS = (address) => `${address?.slice(0,8)}...${address?.slice(address.length -4)}`;

export const copyAddress = (text) =>{
    navigator.clipboard.writeText(text);
    notifySuccess("Address Copied successfully");
}



export async function CONTRACT_DATA(address){
    try{
        const contractObj = await contract();
        const stakingTokenObj = await tokenContract();
        if (address ){
            const contractOwner = await contractObj.owner();
            const contractAddress =  contractObj.address;

            //NOTIFICATIONS
            const notifications = await contractObj.getNotifications();
            const _notificationsArray = await Promise.all(
                notifications.map(async({ pooID, amount, user, typeOf, timestamp})=>{
                    return{
                        poolID : pooID.toNumber(),
                        amount: toEth(amount),
                        user: user,
                        typeOf: typeOf,
                        timestamp: CONVERT_TIMESTAMP_TO_READABLE(timestamp),

                    }
                })
            );

            //pools
            let poolInfoArray = [];
            const poolLength = await contractObj.poolCount();
            const length = poolLength.toNumber();


            for (let i= 0; i< length; i++){
                const poolInfo = await contractObj.poolInfo(i);
                const userInfo= await contractObj.userInfo(i, address);
                const userReward = await contractObj.pendingReward(i, address);
                const tokenPoolInfoA = await ERC20(poolInfo.depositToken, address);
                const tokenPoolInfoB = await ERC20(poolInfo.rewardToken, address);

                const pool = {
                    depositTokenAddress: poolInfo.depositToken,
                    rewardTokenAddress: poolInfo.rewardToken,
                    depositToken: tokenPoolInfoA,
                    rewardToken: tokenPoolInfoB,
                    depositedAmount : toEth(poolInfo.depositedAmount.toString()),
                    apy: poolInfo.apy.toString(),
                    lockDays: poolInfo.lockDays.toString(),

                    //user
                    amount: toEth(StyledUserInfo.amount.toString()),
                    userReward: toEth(userReward),
                    lockUntil: CONVERT_TIMESTAMP_TO_READABLE(
                        userInfo.lockUntil.toNumber()
                    ),
                    lastRewardAt: toEth(userInfo.lastRewardAt.toString()),

                };
                poolInfoArray.push(pool);

            }
            console.log(poolInfoArray);
            const totalDepositAmount = poolInfoArray.reduce((total, pool)=>{
                return total + parseFloat(pool.depositedAmount);
            }, 0);
            const rewardToken = await ERC20(REWARD_TOKEN, address);
            const depositToken = ERC20(DEPOSIT_TOKEN, address);
            const data ={ 
                contractOwner: contractOwner,
                contractAddress: contractAddress,
                notifications: _notificationsArray.reverse(),
                rewardToken: rewardToken,
                depositToken: depositToken,
                poolInfoArray: poolInfoArray,
                totalDepositAmount: totalDepositAmount,
                contractTokenBalance : depositToken.contractTokenBalance - totalDepositAmount,
            };
            return data;


        }

    }catch(error){
        console.log(error);
        console.log(parseErrorMsg(error));
        return parseErrorMsg(error);

    }
}

export async function deposit(poolID, amount, address){
    try{
        notifySuccess("please  wait, calling contract...");
        const contractObj = await contract();
        const stakingTokenObj = await tokenContract();
        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
        const currentAllowance = await stakingTokenObj.allowance(
            address,
            contractObj.address
        );
        if(currentAllowance.lt(amountInWei)){
            notifySuccess("Please wait, approving token...");
            const approveTx = await stakingTokenObj.approve(
                contractObj.address,
                amountInWei
            );
            await approveTx.wait();
            console.log(`Approved ${amountInWei.toString()} tokens for staking`);


        }
        const gasEstimation = await contractObj.estimateGas.deposit(
            Number(poolID),
            amountInWei
        );
        notifySuccess("a moment, staking token call ...");
        const stakeTx = await contractObj.deposit(Number(poolID), amountInWei,{
            gaslimit: gasEstimation,

        });
        const receipt = await stakeTx.wait();
        notifySuccess("Token staked successfully");
        return receipt;
    } catch(error){
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }

}
 export async function transferToken(amount, transferAddress){
    try {
        notifySuccess("Please wait, calling contract token...");
        const stakingTokenObj = await tokenContract();
        const transferAmount = ethers.utils.parseEther(amount);
        const approveTx = await stakingTokenObj.transfer(
            transferAddress,
            transferAmount

        );
          const receipt=  await approveTx.wait();
        notifySuccess("token transfer successfully");
        return receipt;
        
    } catch (error) {
        console.Consolelog(error);
        const errorMsg = parseErrorMsg = parseErrorMsg(error);
        return receipt;
        notifyError(errorMsg);
        
    }

 }



 export async function withdraw(poolID, amount){
    try{
        notifySuccess("Please wait, calling contract...");
        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
        const contractObj = await contract();
        const gasEstimation = await contractObj.estimateGas.withdraw(
            Number(poolID),
            amountInWei
        );
        const data = await contractObj.withdraw(Number(poolID), amountInWei,{
            gasLimit: gasEstimation,

        });
        const receipt = await data.wait();
        notifySuccess("Transactions successfuly completed");
        return receipt;

    }catch(error){
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }

 }
 export async function claimReward(poolID){
    try{
        notifySuccess("Please wait, calling Contract");
        const contractObj = await contract();

        const gasEstimation = await contractObj.estimateGas.claimReward(
            Number(poolID),
          
        );
        const data = await contractObj.claimReward(Number(poolID),  {
            gasLimit : gasEstimation,

        });
        const receipt = await data.wait();
        notifySuccess("claiming  Rewards successfully completed");
        return receipt;


    }catch{
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
 }
 export async function createPool(pool){
    try{
       
        
        const {_depositToken, _rewardToken, _apy, _lockDays}= pool; 
        if (!_depositToken || !_rewardToken || !_apy || !_lockDays)
            return notifyError("provide all the Details");       
            notifySuccess("please wait, calling Contract");
            const contractObj = await contract();
        
        const gasEstimation = await contractObj.estimateGas.addPool(
           _depositToken,
           _rewardToken,
           Number(_apy),
           Number(_lockDays)
          
        );
        const stakeTx = await contractObj.addPool(
            _depositToken,
           _rewardToken,
           Number(_apy),
           Number(_lockDays),
        {
            gasLimit : gasEstimation,

        });
        const receipt = await stakeTx.wait();
        notifySuccess("Pool creation was  successfull ");
        return receipt;


    }catch{
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
 }

 export async function modifyPool(poolID, amount){
    try{
        
            notifySuccess(" please wait, calling Contract");
            const contractObj = await contract();
        
        const gasEstimation = await contractObj.estimateGas.modifyPool(
        
           Number(poolID),
           Number(amount)
          
        );
        const data = await contractObj.modifyPool(Number(poolID), Number(amount),{
            gasLimit: gasEstimation,
            

        });
        const receipt = await data.wait();
        notifySuccess("Pool modified  successfully ");
        return receipt;


    }catch{
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
 }


 
 export async function sweep(tokenData){
    try{
        const {token, amount}= tokenData;
 if (!token || !amount) return notifyError("Data is missing");
        
            notifySuccess("Please wait, calling Contract...");

            const contractObj = await contract();
            const transferAmount= ethers.utils.parseEther(amount);
          
        
        const gasEstimation = await contractObj.estimateGas.sweep(
            token,
             transferAmount
            );
        const data = await contractObj.modifyPool(token, transferAmount,{
            gasLimit: gasEstimation,
            

        });
        const receipt = await data.wait();
        notifySuccess("transaction completed successfully ");
        return receipt;


    }catch{
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
 }


 //ADD TOKEN TO METAMASK

 export const addTokenToMetamask = async()=>{
    if(window.ethereum){
        const contract = await tokenContract();

        const tokenDecimals = await contract.decimals();
        const tokenAddress =  contract.address;
        const tokenSymbol = await contract.symbol();
        const tokenImage =  TOKEN_LOGO;

        try {
            const wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params:{
                    type: "ERC20",
                    options:{
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                        image: tokenImage,
                    },
                }
            });

            if (wasAdded){
                notifySuccess("Token added");
            }else{
                notifyError("Failed to add token");
            }
            
        } catch (error) {
            notifyError("Failed to add token");
            
        }

    } else {
        notifyError("Metamask not installed")
    }
 }

 //ICO CONTRACT

export const BUY_TOKEN = async(amount) =>{
    try {
        notifySuccess("please wait, calling  Contract");
        const contract = await TOKEN_ICO_CONTRACT();

        const tokenDetails = await contract.gettokenDetails();
        const availableToken = ethers.utils.formatEther(
            tokenDetails.balance.toString()
        );

        if (availableToken >1){
            const price = ethers.utils.formatEther(
                tokenDetails.tokenPrice.toString()
            )* Number(amount);
            

        const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

        const transaction = await contract.buyToken(Number(amount), {
            value: payAmount.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
        });
        const receipt = await transaction.wait();

        notifySuccess("Transaction successfully completed");
        return receipt;
        } else{
            notifyError("Token balance is lower than the minimum ");
            return "receipt";
            
        }

    } catch (error){
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
};


export const TOKEN_WITHDRAW = async() =>{
    try {
        notifySuccess(" Please wait, calling  Contract");
        const contract = await TOKEN_ICO_CONTRACT();

        const tokenDetails = await contract.gettokenDetails();
        const availableToken = ethers.utils.formatEther(
            tokenDetails.balance.toString()
        );

        if (availableToken >1){
        const transaction = await contract.withdrawAllTokens(); 
        const receipt = await transaction.wait();
        notifySuccess("Transaction successfully completed");
        return receipt;
        } else{
            notifyError("Token balance is low then expected");
            return "receipt";
            
        }

    } catch (error){
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
};

export const UPDATE_TOKEN = async(_address) =>{
    try {
        if (!_address) return notifyError("Data is missing");
        notifySuccess("Please  wait, Calling contract");

        const contract = await TOKEN_ICO_CONTRACT();

          
        const gasEstimation = await contract.estimateGas.updateToken(_address);

        const transaction = await contract.updateToken(_address, {
            gasLimit:gasEstimation,
        });
        const receipt = await transaction.wait();

        notifySuccess("Transaction successfully completed");
        return receipt;

    } catch (error){
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
};


export const UPDATE_TOKEN_PRICE = async(price) =>{
    try {
        if(!price) return notifyError("Data is missing");
        notifySuccess("Calling contract");
        const contract = await TOKEN_ICO_CONTRACT();
        const payAmount = ethers.utils.parseUnits(price.toString(), "ether");
         
        const gasEstimation = await contract.estimateGas.updateTokenSalePrice(payAmount);

        const transaction = await contract.updateTokenSalePrice(payAmount, {
            gasLimit:gasEstimation,
        });
        const receipt = await transaction.wait();

        notifySuccess("Token price Successfully updated ");
        return receipt;

    } catch (error){
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
};