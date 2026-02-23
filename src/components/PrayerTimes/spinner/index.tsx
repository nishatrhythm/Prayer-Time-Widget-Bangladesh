'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Prayer, ActivePrayer } from '../../../utils/models/Prayer';
import { toBanglaString } from '../../../utils';

interface SpinnerProps {
  prayer: Prayer | null;
  currnet: (index: number) => void;
}

const Spinner: React.FC<SpinnerProps> = ({ prayer, currnet }) => {
  const [spinnerTime, setSpinnerTime] = useState<{ [key: string]: number | undefined }>({});
  const [activePrayer, setActivePrayer] = useState<ActivePrayer | null>(null);

  useEffect(() => {
    if (activePrayer) {
      currnet(activePrayer.index);
    }
  }, [activePrayer, currnet]);

  useEffect(() => {
    const seconds = spinnerTime.seconds;
    if (seconds !== undefined) {
      const elements = document.getElementById('seconds')?.children;
      if (elements) {
        const [f, s, t] = Array.from(elements) as HTMLElement[];
        timeChange(f, seconds);
        timeChange(s, seconds);
        timeChange(t, seconds);
      }
    }
  }, [spinnerTime.seconds]);

  useEffect(() => {
    const minutes = spinnerTime.minutes;
    if (minutes !== undefined) {
      const elements = document.getElementById('minutes')?.children;
      if (elements) {
        const [f, s, t] = Array.from(elements) as HTMLElement[];
        timeChange(f, minutes);
        timeChange(s, minutes);
        timeChange(t, minutes);
      }
    }
  }, [spinnerTime.minutes]);

  useEffect(() => {
    const hours = spinnerTime.hours;
    if (hours !== undefined) {
      const elements = document.getElementById('hours')?.children;
      if (elements) {
        const [f, s, t] = Array.from(elements) as HTMLElement[];
        timeChange(f, hours);
        timeChange(s, hours);
        timeChange(t, hours);
      }
    }
  }, [spinnerTime.hours]);

  const timeChange = (element: HTMLElement, n: number) => {
    const top = element.style.top;
    const num = parseInt(String(n));
    if (top === '-30px') {
      element.style.top = '30px';
      element.style.zIndex = '-1';
      element.textContent = toBanglaString(num === 0 ? '00' : num - 1 < 10 ? `0${num}` : String(num));
    } else if (top === '0px') {
      element.style.top = '-30px';
      element.textContent = toBanglaString(num + 1 === 60 ? '00' : num < 10 ? `0${num}` : String(num));
    } else if (top === '30px') {
      element.style.top = '0';
      element.style.zIndex = '0';
      element.textContent = toBanglaString(num < 10 ? `0${num}` : String(num));
    }
  };

  const intervalCallback = useCallback(() => {
    const active = prayer?.activePrayer;
    if (!active) return;

    const { startTime, endTime } = active;
    setActivePrayer(active);

    const totalTime = endTime.getTime() - startTime.getTime();
    const date = new Date();
    const duration = Math.abs(date.getTime() - endTime.getTime());
    let delta = duration / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = Math.floor(delta % 60);

    const spin = 288 * (totalTime - duration) / totalTime;
    setSpinnerTime({
      stroke: spin,
      hours,
      minutes,
      seconds
    });
  }, [prayer]);

  useEffect(() => {
    if (!prayer?.activePrayer) return;

    const interval = setInterval(intervalCallback, 1000);
    return () => clearInterval(interval);
  }, [prayer, intervalCallback]);

  const getCounter = (key: string) => (
    <span className="count-container">
      <span className="count" id={key}>
        <span className="count-item" style={{ top: -30 }} />
        <span className="count-item" style={{ top: 0 }} />
        <span className="count-item" style={{ top: 30 }} />
      </span>
    </span>
  );

  if (!(prayer && prayer.times.valids)) return null;

  return (
    <div className={`spinner ${activePrayer?.type || ''}`}>
      <svg className="spinner-circle" viewBox="0 0 100 100">
        <circle className="spinner-bg" cx="50" cy="50" r="46" />
        <circle
          strokeMiterlimit={10}
          style={{ strokeDashoffset: spinnerTime.stroke || 0 }}
          className="loader"
          cx="50"
          cy="50"
          r="46"
        />
      </svg>
      <div className="spinner-texts">
        <div className="prayer-name">{activePrayer?.name}</div>
        <div className="prayer-time">ওয়াক্ত শুরু হতে বাকি</div>
        <div className="prayer-left-count">
          <span className="counts">
            <span className="count-hour">{getCounter('hours')}</span>
            <span className="count-text">ঘণ্টা</span>
          </span>
          <span className="counts">
            <span className="count-minutes">{getCounter('minutes')}</span>
            <span className="count-text">মিনিট</span>
          </span>
          <span className="counts">
            <span className="count-seconds">{getCounter('seconds')}</span>
            <span className="count-text">সেকেন্ড</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
