import React, {useEffect, useState} from "react";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import logo from "../public/img/logo.svg"
import  {Link} from "react-router-dom"
import { PiPottedPlantDuotone } from "react-icons/pi";
// INTERNAL IMPORT
import {MdGeneratingTokens} from "../Components/ReactICON/index";

const Header = ({ page }) => {
  const [tokenBalComp, setTokenBalComp]= useState();


  const navigation = [
    // {
    //   name:"",
    //   link: "#home",
    // },

    {
      name:"Staking Pools",
      link: "#staking",
    },
    {
      name: "Staking Rewards",
      link: "#crypto",
    },
    {
      name: "Claim Rewards",
      link: "#rewards",
    },
    {
      name: "Partners",
      link: "#partners",
    },

 ];

  return (
 
    <header  className="header" >
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="header__content">
            <button 
            className="header__btn" 
            type="button"
            aria-label="header__nav">

            <span/>
            <span/>
            <span/>
            </button>
            
     

          <span style={{color:"white", font: "bold", fontSize: "30px" }}className=" header__text--size">ZURI-defi <PiPottedPlantDuotone className="plant-color" size={40}/></span>
          <ul style={{ color: "white" , padding:"70px"}} className="header__nav" id="header--nav">
        {navigation.map((item, index) => (
            <li key={index}>
                                                                                                  <a
        href={
          page === "activity"
            ? "/"
            : page === "admin"
            ? "/"
            : `${item.link}`
        }
      >
        {item.name}
      </a>
    </li>
  ))}
</ul>

              <ConnectButton/>

              <a 
              style={{
                marginLeft: "10px",
              }}
              data-bs-target="#Modal-deposit1"
              type="button"
              data-bs-toggle="modal"
              className="header__profile"
              >
                {/* <i className="ti ti-user-circle">
                  < MdGeneratingTokens/>
                </i> */}

                <span>TOKENS ICO</span>
              </a>

          </div>

        </div>
      </div>
    </div>

  </header >



  )
   
  
};

export default Header;
