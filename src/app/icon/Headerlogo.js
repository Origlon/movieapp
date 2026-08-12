import * as React from "react";

export const HeaderLogo = ({ color = "#4338CA", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.667.5v16.667M13 .5v16.667M.5 8.833h16.667M.5 4.667h4.167M.5 13h4.167M13 13h4.167M13 4.667h4.167M2.317.5H15.35c1.003 0 1.817.813 1.817 1.817V15.35a1.817 1.817 0 0 1-1.817 1.817H2.317A1.817 1.817 0 0 1 .5 15.35V2.317C.5 1.313 1.313.5 2.317.5Z"
    />
  </svg>
);