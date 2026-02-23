import React from 'react';

interface PrayerHeaderProps {
  className?: string;
}

const PrayerHeader: React.FC<PrayerHeaderProps> = ({ className }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/prayer-header.svg"
    alt=""
    className={className}
    height="171"
    width="300"
  />
);

export default PrayerHeader;