import React from 'react';

interface PrayerSunriseProps extends React.SVGProps<SVGSVGElement> {}

const PrayerSunrise: React.FC<PrayerSunriseProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#EF4123"
      d="m19.057 17.591-.001.052H4.843l-.001-.052a7.108 7.108 0 1 1 14.215 0M12.309 6l-.724.001.004 3.536.724-.001zM16.326 10.793l-.632-.351L17.42 7.33l.633.352zM21.62 11.39l-3.011 1.854.38.617L22 12.006z"
    />
    <path
      fill="#EF4123"
      d="m6.585 7.304-.632.353 1.72 3.078.632-.353zM2.37 11.353l-.37.622 3.017 1.796.37-.622z"
    />
  </svg>
);

export default PrayerSunrise;