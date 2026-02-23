import { toBanglaString } from '../index';
import { District } from '../constants';

export class Place {
  name: string;
  bnName: string;
  sehri: number;
  iftar: number;

  constructor(place: District) {
    this.name = place.name;
    this.bnName = place.bnName;
    this.sehri = place.sehri;
    this.iftar = place.iftar;
  }
}

export function convertTime(date: Date | null): string {
  if (!date || !checkDate(date)) return '০০:০০';
  const dateString = date.toLocaleTimeString('en', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/am|pm|\s/gi, '');
  return toBanglaString(dateString);
}

function deduct(date: Date, seconds: number = 0, minutes: number = 0): Date {
  const newDate = new Date(date);
  newDate.setSeconds(newDate.getSeconds() + seconds);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}

function checkDate(d: any): boolean {
  const date = new Date(d);
  return date instanceof Date && !isNaN(date.getTime());
}

export function jumaCheck(date: Date | null): string {
  if (!date) return 'জোহর';
  const today = new Date(date);
  return today.getDay() === 5 ? 'জুমা' : 'জোহর';
}

export interface PrayerTimesData {
  date: string;
  sehri: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  sunrise: string;
  tomorrow_sehri: string;
  tomorrow_fajr: string;
  tomorrow_sunrise: string;
  tomorrow_maghrib: string;
  yesterday_isha: string;
}

export class Times {
  times: PrayerTimesData;
  date: Date;
  sehri: Date;
  sunrise: Date;
  fajr: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  prevIsha: Date;
  tomorrowFajr: Date;
  tomorrowSehri: Date;
  tomorrowSunrise: Date;
  tomorrowMagrib: Date;

  constructor(times: PrayerTimesData) {
    this.times = times;
    this.date = new Date(times.date);
    this.sehri = new Date(times.sehri);
    this.sunrise = new Date(times.sunrise);
    this.fajr = new Date(times.fajr);
    this.dhuhr = new Date(times.dhuhr);
    this.asr = new Date(times.asr);
    this.maghrib = new Date(times.maghrib);
    this.isha = new Date(times.isha);
    this.prevIsha = new Date(times.yesterday_isha);
    this.tomorrowFajr = new Date(times.tomorrow_fajr);
    this.tomorrowSehri = new Date(times.tomorrow_sehri);
    this.tomorrowSunrise = new Date(times.tomorrow_sunrise);
    this.tomorrowMagrib = new Date(times.tomorrow_maghrib);
  }

  get valids(): boolean {
    return Object.values(this.times).every(checkDate);
  }
}

export interface ActivePrayer {
  index: number;
  name: string;
  startText: string;
  startTime: Date;
  endTime: Date;
  type?: string;
}

export interface SunriseInfo {
  time: string;
  text: string;
}

export interface SehriIftarInfo {
  time: string;
  text: string;
}

export class Prayer {
  place: Place;
  times: Times;

  constructor(times: Times, place: Place = new Place({ name: 'Dhaka', bnName: 'ঢাকা', sehri: 0, iftar: 0 })) {
    this.place = place;
    this.times = times;
  }

  setPlace(place: Place): void {
    this.place = place;
  }

  get sehri(): Date {
    return deduct(this.times.sehri, 0, this.place.sehri);
  }

  get fajr(): Date {
    return deduct(this.times.fajr, 0, this.place.sehri);
  }

  get sunrise(): Date {
    return deduct(this.times.sunrise, 0, this.place.sehri);
  }

  get dhuhr(): Date {
    return deduct(this.times.dhuhr, 0, this.place.sehri);
  }

  get asr(): Date {
    return deduct(this.times.asr, 0, this.place.sehri);
  }

  get maghrib(): Date {
    return deduct(this.times.maghrib, 0, this.place.iftar);
  }

  get isha(): Date {
    return deduct(this.times.isha, 0, this.place.iftar);
  }

  get prevIsha(): Date {
    return deduct(this.times.prevIsha, 0, this.place.iftar);
  }

  get nextFajr(): Date {
    return deduct(this.times.tomorrowFajr, 0, this.place.sehri);
  }

  get nextSehri(): Date {
    return deduct(this.times.tomorrowSehri, 0, this.place.sehri);
  }

  get nextSunrise(): Date {
    return deduct(this.times.tomorrowSunrise, 0, this.place.sehri);
  }

  get nextMagrib(): Date {
    return deduct(this.times.tomorrowMagrib, 0, this.place.iftar);
  }

  get currentSunrise(): SunriseInfo {
    const date = new Date();
    const next = date > this.dhuhr;
    return {
      time: next ? convertTime(this.nextSunrise) : convertTime(this.sunrise),
      text: `${next ? 'আগামীকাল ' : ''}সূর্যোদয়`
    };
  }

  get currentSehri(): SehriIftarInfo {
    const date = new Date();
    const next = date > this.dhuhr;
    return {
      time: next ? convertTime(this.nextSehri) : convertTime(this.sehri),
      text: 'সাহ্‌রি শেষ'
    };
  }

  get currentIftar(): SehriIftarInfo {
    const date = new Date();
    const next = date > this.isha;
    return {
      time: next ? convertTime(this.nextMagrib) : convertTime(this.maghrib),
      text: 'ইফতার শুরু'
    };
  }

  get activePrayer(): ActivePrayer | null {
    const date = new Date();
    const fajr = this.fajr;
    const nextFajr = this.nextFajr;
    const dhuhr = this.dhuhr;
    const asr = this.asr;
    const maghrib = this.maghrib;
    const isha = this.isha;

    if (date >= fajr && date < dhuhr) {
      const name = jumaCheck(date);
      return {
        index: 1,
        name,
        startText: `দুপুর ${convertTime(dhuhr)}`,
        startTime: fajr,
        endTime: dhuhr
      };
    } else if (date >= dhuhr && date < asr) {
      return {
        index: 2,
        name: 'আসর',
        startText: `বিকাল ${convertTime(this.asr)}`,
        startTime: dhuhr,
        endTime: asr
      };
    } else if (date >= asr && date < maghrib) {
      return {
        index: 3,
        name: 'মাগরিব',
        startText: `সন্ধ্যা ${convertTime(maghrib)}`,
        startTime: asr,
        endTime: maghrib
      };
    } else if (date >= maghrib && date < isha) {
      return {
        index: 4,
        name: 'এশা',
        startText: `রাত ${convertTime(this.isha)}`,
        startTime: maghrib,
        endTime: deduct(isha)
      };
    } else if (date < fajr || date >= isha && date < nextFajr) {
      const today = date < fajr;
      return {
        index: 5,
        name: 'ফজর',
        startText: `ভোর ${convertTime(today ? fajr : nextFajr)}`,
        startTime: today ? this.prevIsha : isha,
        endTime: today ? fajr : nextFajr
      };
    }
    return null;
  }
}