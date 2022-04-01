import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <span className="name">
        Inshorts clone made by -{" "}
        <a
          href="https://www.linkedin.com/in/abdul-mannan-khan-9b8ba6176"
          target="__blank"
        >
          Abdul Mannan Khan
        </a>
      </span>
      <hr style={{ width: "90%" }} />
      <div className="iconContainer">
        <a
          href="https://www.instagram.com/mannan.khan63/?hl=en"
          target="__blank"
        >
          <i class="fa-brands fa-instagram fa-2x"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/abdul-mannan-khan-9b8ba6176"
          target="__blank"
        >
          <i class="fa-brands fa-linkedin fa-2x"></i>
        </a>
        <a href="https://github.com/Abdulmannankhann" target="__blank">
          <i class="fa-brands fa-github fa-2x"></i>
        </a>
      </div>
    </div>
  );
};

export default Footer;
