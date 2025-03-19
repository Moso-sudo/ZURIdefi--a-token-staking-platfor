import React, {useState} from "react";

import { IoMdClose } from "./ReactICON";
import  PopUpInputField from "./Admin/RegularComp/PopUpInputField";
import  PupUpButton from "./Admin/RegularComp/PupUpButton";


const WithdrawModal = ({

    withdraw,
    withdrawPoolID,
    address,
    setLoader,
    claimReward,
}) => {
  const [amount, setAmount] = useState


  const CALLING_FUNCTION = async ( withdrawPoolID, amount, address)=>{
    setLoader(true);

    const receipt = await deposit( withdrawPoolID, amount, address);
    if(receipt){
      console.log(receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  const CALLING_CLAIM = async ( withdrawPoolID)=>{
    setLoader(true);

    const receipt = await claimReward( withdrawPoolID);
    if(receipt){
      console.log(receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };
  return (
    <div 
    className="modal modal--auto fade"
    id="modal-node"
    tabIndex={-1}
    aria-labelledby="modal-apool"
    aria-hidden="true"
    
    >
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal__content">
            <button className="modal__close" type="button" data-bs-dismiss="modal" arai-label="close">
              <i className="ti ti-x"><IoMdClose/></i>
            </button>
            <h4 className="modal__title"> Withdraw Token</h4>
            <p className="modal__text">
            Following the lock-up period, your NEO tokens will be available for withdrawa
            </p>
            <div className="modal__form">
              <PopUpInputField
              titl={`Amount`}
              placeholder="Amount"
              handleChange={()=>setAmount(e.target.value)}
              />
              <PupUpButton title={"Withdraw"}
                handleClick={()=> CALLING_FUNCTION( withdrawPoolID, amount, address) 

                }
                />


              <PupUpButton title={"Claim Reward"}
                handleClick={()=> CALLING_CLAIM( withdrawPoolID) 

                }
                />

              </div>
            </div>
            </div>
            </div>


    </div>


  )
};

export default WithdrawModal;
