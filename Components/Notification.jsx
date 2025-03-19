import React from "react";
import {SHORTEN_ADDRESS, copyAddress} from "../Context/index";
import { FaRegCopy } from "react-icons/fa6";

const Notification = () => {

  const notificationArray = poolDetails?.Notification ?? [];
  return (

        <div  className="section">
        <div className="container">
          <div className="row">
          {

        page != "activity" && (
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl">
              <div className="section__title">
                <h2>Active Live</h2>
                <p> "Unlock the potential of your NEO tokens! Stake them in our pools to earn consistent rewards and contribute to the growth of a transparent and secure  platform."</p>
              </div>
    
            </div>



      )
    }
        <div className="col-12">
          <div className="deals scrollable-div"
           style={{
            overflow: "scroll",

          }} >
            <table className="deals__table">
              <thead>
                <tr>
                  <th>TypeOf</th>
                  <th>Token</th>
                  <th>User</th>
                  <th>Pool ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  notificationArray.map((notify, index)=>(
                    <tr key={index}>
                      <td>
                        <div className="deals__text">
                          {notify?.typeOf}
                        </div>
                      </td>

                      <td>
                        <div className="deals__exchange">
                        <img src="img/exchanges/ethereum.png" alt="" />
                        <span className="green">
                          {poolDetails.rewardToken.symbol}{" "}
                          {poolDetails?.rewardToken.name}
                        </span>
                        <span className="red">
                          &nbsp; &nbsp;<FaRegCopy onClick ={()=>
                            copyAddress(poolDetails?.rewardToken.address)
                          }/>

                        </span>
                        </div>
                      </td>

                    <td>
                      <div className="deals__text deals__text--green">
                        {SHORTEN_ADDRESS(notify.user)} &nbsp; &nbsp;

                        <span className="red">
                          &nbsp; &nbsp;<FaRegCopy onClick ={()=>
                            copyAddress(notify.user)
                          }/>
                          </span>
                      </div>
                    </td>

                    <td className="deals__text">
                      {`#00-${notify?.poolID}`}


                    </td>

                    <td className="deals__text deals__text--sell">
                      {`${notify?.amount}`} {" "}
                      {poolDetails?.rewardToken.symbol}


                    </td>

                    <td className="deals__text deals__text--sell">
                      {`${notify?.timestamp}`}


                    </td>


                    </tr>

                  )).slice(0,10)
                }

              </tbody>
            </table>
          </div>
      </div>

      { page != "activity" &&(
        <div className="col-12">
          <div className="section_btns">
            <a href="/activities" className="section"></a>
          </div>
        </div>

      )}
    </div>
    </div>
  </div>



  );
};

export default Notification;
