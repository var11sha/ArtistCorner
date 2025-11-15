import React, { useEffect } from "react";

function Footer(){

    return(
 
        <footer>
        <div className="footer">
  <div>
      <h2>100% Secure Payments</h2>
      <h1>Hassel Free Replacement</h1>
      <h4>7-day easy replacement policy</h4>
  </div>
  <div>
     <a href="artwork_page.html"><i className="artist_icon fa-solid fa-palette"></i></a>
     <a href="book_page.html"><i className="artist_icon fa-solid fa-book"></i></a>
  </div>
        <div className="footer_img">
         <div className="footer_detail">
           <div className="support">
             <h3>SUPPORT</h3>
             <p>Customer Service</p>
             <p>Service Center</p>
           </div>
           <div className="support">
             <h3>ABOUT US</h3>
              <a style="color: black;text-decoration: none;" href="about.html"><p>Artist Corner</p></a>
              <p>Product Quality</p>
           </div>
           <div className="support">
             <h3>CONTACT US</h3>
             <p>Email</p>
           </div>
         </div>

          <div className="copyright">
            <p>copyright@2024-2026 Artist Corner</p>
          </div>
       </div>
     </div>

    </footer> 
    );
}

export default Footer;