import * as React from "react";

export const LightLogo = ({ isDark, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    {isDark ? (
      <path
        d="M8 2V1M8 15V14M14 8H15M1 8H2M12.24 3.76L12.95 3.05M3.05 12.95L3.76 12.24M12.24 12.24L12.95 12.95M3.05 3.05L3.76 3.76M11 8C11 9.657 9.657 11 8 11C6.343 11 5 9.657 5 8C5 6.343 6.343 5 8 5C9.657 5 11 6.343 11 8Z"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M6.5 0.5A4.243 4.243 0 1 0 12.5 6.5A6 6 0 1 1 6.5 0.5Z"
        stroke="#18181B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);
