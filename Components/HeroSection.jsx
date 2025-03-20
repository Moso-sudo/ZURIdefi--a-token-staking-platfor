import React, {useEffect, useState} from "react";
import { useAccount } from "wagmi";
 import { ReactTyped } from "react-typed";

const CURRENCY  =process.env.NEXT_PUBLIC_CURRENCY;
import  {LOAD_TOKEN_ICO} from "../Context/constants"
import {TiTick} from "./ReactICON"

const HeroSection = ( {poolDetails, addTokenToMetamask}) => {
  const  {address} = useAccount();
  const  [percentage, setPercentage]=useState();
  const [tokenDetails, setTokenDetails]=useState();

  useEffect(()=>{
    if(address){
      const loadToken = async()=>{
        const token = await LOAD_TOKEN_ICO();
        setTokenDetails(token);
      };
      loadToken();
    }
  }, [address]);

  useEffect(()=>{
    const calculatePercentage =()=>{
      const tokenSold = tokenDetails?.soldTokens ?? 0;
      const tokenTotalSupply =tokenDetails?.soldTokens + Number(tokenDetails?.tokenBal)* 1 ?? 1;

      // const percentageNew =(tokenSold/tokenTotalSupply) * 100;


      if (tokenTotalSupply===0){
        console.log("NEO Token balance is zero, cannot calculate percentage");
      }else{
        setPercentage(tokenTotalSupply);
      }
    };
    const timer =setTimeout(calculatePercentage, 1000);
 

  return ()=>clearTimeout(timer);
}, [tokenDetails]);

  return(
    <section id="home" className="hero" >
      <div className="container">
        <div className="row">
          {/* 1 */}
          <div className="col-12 col-lg-7 col-xl-6">
            <div className="hero__content hero__content--first">
              <h1 style={{fontFamily:"Montreta"}} className="hero__title">
              Token Staking platform build on  <a href="">LISK- </a> <span style={{ textTransform: "lowercase", fontSize:"18px"}}>a layer two scalling solution leveraging all the Power of  blockchain! <span>Secure, Transparent, Censorship Resistant while Enjoying Lowered transaction gas fees !</span></span>
              

              </h1>
           
          
              <p className="stake__earn-grow">
                <ReactTyped strings={['Stake' ,'Earn', ' Grow!', 'Stake, Earn, Grow!']}
                          className=' text-orange  fond-large md:text-3xl sm:text-4xl text-xl md:pl-4 pl-2' 
                          typeSpeed={50}
                          backSpeed={50}
                          
                          /> 
                </p>
              <div className="hero__btns">
                <a data-bs-target="#modal-deposit1" type="button" data-bs-toggle="modal" className="hero__btn">
                  BUY{tokenDetails?.symbol}  {""}
                  Token
                </a>
                <a onClick={()=>addTokenToMetamask()}
                  className="hero__btn
                  hero__btn--light">
                    Add Token {tokenDetails?.symbol || ""}
                  </a>

              </div>
            </div>
          </div>
          {/* 2 */}

          <div className="col-12 col-md-6 col-lg-5 col-xl-4 offset-xl-2">
            <div className="hero__content hero__content--second">
              <div className="node node--hero">
                <h3 className="">
                  <b style={{color:"green"}}>{tokenDetails?.symbol || ""}</b >ZUR Token ICO
                </h3>
                <span className="node__date">
                  {tokenDetails?.tokenPrice || ""}
                  {CURRENCY}
                </span>
                <span  className="node__price">
                  ZUR ICO Left: <b>{tokenDetails?.tokenBal || ""}{tokenDetails?.symbol}</b>
                </span>
                {/* <span className="node__line">
                  <img src="img/dodgers/dots--line-red.svg" alt="" />
                </span> */}
                <ul className="node__list">
                  <li>
                    <i className="ti">
                      <TiTick/>
                    </i>
                    <b>_%</b> of the deposit amount
                  </li>

                  <li>
                    <i className="ti">
                      <TiTick/>
                    </i>
                    <b>{tokenDetails?.supply}
                      {tokenDetails?.symbol}
                      </b>{" "} total supply
                  </li>
                </ul>

                <div className={"progressbar progressbar--cta"}>
                  <h3 className="progressbar__title"> 
                   ZUR ICO Sale: {tokenDetails?.soldTokens}
                    {tokenDetails?.symbol}
                    </h3>

                  <div
                  className="progress"
                  role="progressbar"
                  aria-label="Animated striped"
                  aria-valuenow={60}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  >

                    <div className="progress-bar
                     progress-bar-striped 
                    progress-bar-animated 
                    style={{
                    width : `${percentage}%`,
                    }}">

                      <span>{tokenDetails?.soldTokens}</span>
                    </div>
                  </div>


                <div className="progressbar__values">
                  <span className="progressbar__value
                  progressbar__value--left"></span>

                  <span className="progressbar__value
                  progressbar__value--right">
                    {Number(tokenDetails?.tokenBal || 0) + Number(tokenDetails?.soldTokens || 0)}
                  </span>
                </div>

                </div>
              </div>
            </div>
          </div>



        </div>
      </div>
    </section>

  ) 
};

export default HeroSection;
