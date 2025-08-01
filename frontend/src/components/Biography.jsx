import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
           We are an enthusiastic group of tech professionals committed
            to improving hospital systems through innovative software solutions. 
            Our vision is to bridge the gap between medical services and digital 
            efficiency by crafting reliable, intelligent tools for healthcare environments.
          </p>
          <p>We are all in 2025!</p>
          <p>We are working on a MERN STACK PROJECT.</p>
          <p>
            This system is designed to reduce administrative burden, 
            automate patient and staff management, and enhance the 
            overall service quality within hospitals. From appointment scheduling 
            to inventory tracking, our platform provides intuitive features that cater 
            to modern medical demands.
          </p>
          <p>We believe in smart solutions that prioritize both healthcare providers and patients.</p>
          <p>Developing this system is not just about code — it's about meaningful impact.</p>
        </div>
      </div>
    </>
  );
};

export default Biography;
