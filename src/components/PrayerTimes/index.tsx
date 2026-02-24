'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Spinner from './spinner/index';
import PrayerHeader from '../../assets/icons/PrayerHeader';
import PrayerSunrise from '../../assets/icons/PrayerSunrise';
import { Prayer, Place, Times, convertTime, jumaCheck } from '../../utils/models/Prayer';
import { prayerDistricts } from '../../utils/constants';
import { prayerApi, getStorage, setStorage, toBanglaString } from '../../utils';

interface PrayerTimesProps {
  widgetHeight?: number;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ widgetHeight }) => {
  const [city, setCity] = useState<Place>(new Place(prayerDistricts.getDistrict('Dhaka')!));
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [showPlaces, setShowPlaces] = useState(false);
  const [prayerIndex, setPrayerIndex] = useState<number | undefined>();
  const [timelineLoaded, setTimelineLoaded] = useState(false);
  const [animatingTimes, setAnimatingTimes] = useState<string[]>(['০০:০০', '০০:০০', '০০:০০', '০০:০০', '০০:০০']);
  const timelineAnimRef = useRef(false);

  useEffect(() => {
    const dist = getStorage('district');
    const pTimes = getStorage('prayer-time-widget');

    let place: Place | undefined;
    if (dist) {
      place = new Place(dist);
      setCity(place);
    }

    if (pTimes) {
      const times = new Times(pTimes);
      if (!times.valids) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('prayer-time-widget');
        }
        return;
      }
      const today = new Date().toLocaleDateString();
      const cacheDate = times.date.toLocaleDateString();
      if (today !== cacheDate) {
        prayerApiCalling(place);
      } else {
        const _times = new Times(pTimes);
        setPrayer(new Prayer(_times, place || city));
      }
    } else {
      prayerApiCalling(place);
    }
  }, []);

  const prayerApiCalling = async (place?: Place) => {
    try {
      const res = await prayerApi();
      const data = await res.json();
      const times = new Times(data);
      if (!times.valids) return;
      setPrayer(new Prayer(times, place || city));
      setStorage('prayer-time-widget', data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const outsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.id === 'place') {
        setShowPlaces(prev => !prev);
      } else if (target.id !== 'places') {
        setShowPlaces(false);
      }
    };

    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, []);

  const currentHandler = useCallback((curIndex: number) => {
    setPrayerIndex(curIndex);
  }, []);

  useEffect(() => {
    changeSteps();
  }, [prayerIndex]);

  useEffect(() => {
    if (!prayer || timelineAnimRef.current) return;
    timelineAnimRef.current = true;
    const finalTimes = [
      convertTime(prayer.fajr),
      convertTime(prayer.dhuhr),
      convertTime(prayer.asr),
      convertTime(prayer.maghrib),
      convertTime(prayer.isha)
    ];
    let frame = 0;
    const totalFrames = 12;
    const timerId = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        clearInterval(timerId);
        setAnimatingTimes(finalTimes);
        setTimelineLoaded(true);
      } else {
        setAnimatingTimes(finalTimes.map(() => {
          const h = Math.floor(Math.random() * 12) + 1;
          const m = Math.floor(Math.random() * 60);
          return toBanglaString(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`);
        }));
      }
    }, 50);
    return () => clearInterval(timerId);
  }, [prayer]);

  const changeSteps = () => {
    const index = prayerIndex;
    if (typeof index !== 'number') return;
    const dots = document.getElementById('arrow-steps');
    const names = document.getElementById('prayers-name');
    const times = document.getElementById('prayer-times');

    if (dots && names && times) {
      const dotElements = dots.children;
      const nameElements = names.children;
      const timeElements = times.children;

      Array.from(dotElements).slice(1).forEach((dot, i) => {
        const dotElement = dot as HTMLElement;
        if (i === index - 1) {
          dotElement.style.fill = 'var(--dot-color)';
        } else {
          dotElement.style.fill = 'var(--dot-default-color)';
        }
      });

      Array.from(nameElements).forEach((name, i) => {
        const nameElement = name as HTMLElement;
        if (i === index - 1) {
          nameElement.style.fill = 'var(--rgbBlack)';
          nameElement.style.fontWeight = 'var(--bold)';
        } else {
          nameElement.style.fill = 'var(--black87)';
          nameElement.style.fontWeight = 'var(--regular)';
        }
      });

      Array.from(timeElements).forEach((time, i) => {
        const timeElement = time as HTMLElement;
        if (i === index - 1) {
          timeElement.style.fill = 'var(--rgbBlack)';
          timeElement.style.fontWeight = 'var(--bold)';
        } else {
          timeElement.style.fill = 'var(--black87)';
          timeElement.style.fontWeight = 'var(--regular)';
        }
      });
    }
  };

  const cityChange = (district: any) => {
    const dist = new Place(district);
    prayer?.setPlace(dist);
    setCity(dist);
    setShowPlaces(false);
    setStorage('district', district);
  };

  return (
    <div className="base" style={{ height: widgetHeight ? `${widgetHeight}px` : undefined }}>
      <div className="prayer">
        <div className="header">
          <PrayerHeader className="header-icon" />
          <div className="header-content">
            <h3 className="header-text">আজকের নামাজের সময়সূচি</h3>
            <div className="header-place">
              <span>জেলা:</span>
              {prayer ? (
                <span className="place fade-in" id="place">{city.bnName}</span>
              ) : (
                <span className="shimmer-line" style={{ width: 70, height: 16, verticalAlign: 'middle', marginLeft: 4 }}>&nbsp;</span>
              )}
              {showPlaces && (
                <div className="places" id="places">
                  {prayerDistricts.districts.map((district, index) => (
                    <div
                      key={index}
                      onClick={() => cityChange(district)}
                      className="place-item"
                    >
                      {district.bnName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="center">
          <Spinner prayer={prayer} currnet={currentHandler} />
          <div className="prayers">
            <div className="prayers-time-steps">
              <svg width="100%" height="30" id="prayers-name" className="prayers-name">
                <text x="14" y="20">ফজর</text>
                <text x="68" y="20">{jumaCheck(prayer?.dhuhr || null)}</text>
                <text x="130" y="20">আসর</text>
                <text x="180" y="20">মাগরিব</text>
                <text x="250" y="20">এশা</text>
              </svg>
              <svg className="arrow-steps" width="268" height="12" viewBox="0 0 268 12" fill="none" id="arrow-steps">
                <rect y="4.5" width="268" height="4" fill="#ffcabb" />
                <circle cx="14" cy="6" r="6" />
                <circle cx="73" cy="6" r="6" />
                <circle cx="134" cy="6" r="6" />
                <circle cx="190" cy="6" r="6" />
                <circle cx="250" cy="6" r="6" />
              </svg>
              <svg id="prayer-times" width="100%" height="24" className="prayers-times">
                <text x="10" y="16">{timelineLoaded ? convertTime(prayer?.fajr || null) : animatingTimes[0]}</text>
                <text x="70" y="16">{timelineLoaded ? convertTime(prayer?.dhuhr || null) : animatingTimes[1]}</text>
                <text x="130" y="16">{timelineLoaded ? convertTime(prayer?.asr || null) : animatingTimes[2]}</text>
                <text x="190" y="16">{timelineLoaded ? convertTime(prayer?.maghrib || null) : animatingTimes[3]}</text>
                <text x="250" y="16">{timelineLoaded ? convertTime(prayer?.isha || null) : animatingTimes[4]}</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="bottom-up">
            <PrayerSunrise className="sunrise-icon" height="24" width="24" />
            <div className="sunrise-content">
              {prayer ? (
                <>
                  <div className="sunrise-text fade-in">{prayer.currentSunrise.text}</div>
                  <div className="sunrise-time fade-in"> ভোর {prayer.currentSunrise.time}</div>
                </>
              ) : (
                <>
                  <span className="shimmer-line-dark" style={{ width: 90, height: 16 }}>&nbsp;</span>
                  <span className="shimmer-line-dark" style={{ width: 60, height: 14, marginLeft: 6 }}>&nbsp;</span>
                </>
              )}
            </div>
          </div>
          <div className="bottom-down">
            <div className="content">
              {prayer ? (
                <>
                  <div className="sahri-text fade-in">{prayer.currentSehri.text}</div>
                  <div className="sahri-time fade-in">ভোর {prayer.currentSehri.time}</div>
                </>
              ) : (
                <>
                  <span className="shimmer-line-dark" style={{ width: 65, height: 16 }}>&nbsp;</span>
                  <span className="shimmer-line-dark" style={{ width: 60, height: 14, marginTop: 4 }}>&nbsp;</span>
                </>
              )}
            </div>
            <div className="content">
              {prayer ? (
                <>
                  <div className="iftar-text fade-in">{prayer.currentIftar.text}</div>
                  <div className="iftar-time fade-in">সন্ধ্যা {prayer.currentIftar.time}</div>
                </>
              ) : (
                <>
                  <span className="shimmer-line-dark" style={{ width: 65, height: 16 }}>&nbsp;</span>
                  <span className="shimmer-line-dark" style={{ width: 70, height: 14, marginTop: 4 }}>&nbsp;</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="prayer-footer">
          <div style={{ marginTop: '5px' }}>সূত্র: ইসলামিক ফাউন্ডেশন বাংলাদেশ</div>
          <hr style={{ borderTop: '1px dashed var(--black12)', borderBottom: 'none', borderLeft: 'none', borderRight: 'none', width: '100%', margin: '5px 0' }} />
          <div><a href="https://github.com/nishatrhythm/Prayer-Time-Widget-Bangladesh" target="_blank" rel="noopener noreferrer" className="footer-link">গিটহাবে</a> সোর্স কোড পাওয়া যাবে</div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;