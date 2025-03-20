import React from "react";

const Ask = ({setContactUs}) => {
  return (
    <section id="ask" className="section">

      <div className="container">
        <div className="row row-relative">
          <div className="col-12">
            <div className="question">
              <h2 className="question__title">Any Questions/ Inquiries</h2>
              <p className="question__text">
                Feel free to send us an email <br/>
                Our Support  team is always on call, and ready to help with all your questions
              </p>
              <div className="section_btns section__btns--mt">
                <button
                style={{color:"#123962"}}
                className="section_btn section__btn--light"
                onClick={()=>setContactUs(true)}
                >Ask a question</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  
  )
  
 
};

export default Ask;
