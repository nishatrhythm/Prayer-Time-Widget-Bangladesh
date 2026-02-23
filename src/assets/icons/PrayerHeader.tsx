import React from 'react';
import prayerHeaderSvg from './prayerHeaderSvgString';

interface PrayerHeaderProps {
  className?: string;
}

const PrayerHeader: React.FC<PrayerHeaderProps> = () => (
  <div dangerouslySetInnerHTML={{ __html: prayerHeaderSvg }} style={{ display: 'contents' }} />
);

export default PrayerHeader;