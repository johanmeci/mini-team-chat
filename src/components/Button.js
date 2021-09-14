import React from "react";

const Button = ({ onClick = null, children = null, classBtn = '' }) => (
  <button className={"btn "+classBtn} onClick={onClick}>{children}</button>
);

export default Button;