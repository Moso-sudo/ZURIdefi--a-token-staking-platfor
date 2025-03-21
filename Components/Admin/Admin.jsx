import React from "react";
import AdminNav from "./AdminNav";
import AdminCard from "./AdminCard";
import Token from "./Token";
import Investing from "./Investing";
import Transfer from "./Transfer";
import Pool from "./Pool";
import  Staking from "./Staking";
import ICOToken from "./ICOToken";



const Admin = ({
    poolDetails,
    transferToken,
    address,
    setLoader,
    createPool,
    sweep,
    setModifyPoolID,
}) => {
  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <AdminNav/>
          <div className="col-12 col-lg-9 ">
            <div className="tab-content">
              <div className="tab-pane 
              fade
               show 
               active" 
               id="tab-1"
               role="tabpanel">
                <div className="row">
                  {poolDetails?.poolInfoArray.map((pool, index)=>(
                    <AdminCard
                    key ={index}
                    name={`Current APY: ${pool.apy} %`}
                    value ={`${pool.depositedAmount} 
                      ${Pool.depositToken.symbol}`}
                    />
                  ))}

                  <AdminCard
                  
                    name={`Total Stake`}
                    value ={`${poolDetails?.depositedAmount|| "0" } 
                      ${poolDetails?.
                        depositToken().symbol}`}
                    />

                   <AdminCard
                    
                    name={`Your Balance`}
                    value ={`${poolDetails?.
                      depositToken.balance.slice(0,8)} 
                      ${poolDetails?.
                        depositToken.symbol}`}
                    />
                        <AdminCard
                  
                    name={`Available Supply`}
                    value ={`${poolDetails?.
                      contractTokenBalance.slice(0,8)} 
                      ${poolDetails?.
                        depositToken().symbol}`}
                    />
                    <Token token={poolDetails?.depositToken
                    }/>

                </div>

                <Investing poolDetails={poolDetails}/>
                <Staking
                     poolDetails={poolDetails}
                     sweep={sweep}
                     setLoader={setLoader}
                
                />
                <Transfer
                  poolDetails={poolDetails}
                  transferToken={transferToken}
                  setLoader={setLoader}
                  address={address}
                
                />
                <Pool
                poolDetails={poolDetails}
                createPool={createPool}
                setLoader={setLoader}
                setModifyPoolID={setModifyPoolID}
                />
                <ICOToken setLoader={setLoader}/>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  );
};

export default Admin;
