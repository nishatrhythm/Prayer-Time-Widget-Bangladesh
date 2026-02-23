const engToBnNumber = (char: string): string => {
  const numbersObj: Record<string, string> = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
    '.': '.',
    '-': '-'
  };
  return numbersObj[char] || char;
};

export function toBanglaString(value: string | number): string {
  return String(value).split('').map(num => engToBnNumber(num)).join('');
}

export function toBanglaNum(value: number): string {
  if (isNaN(parseFloat(String(value))) || isNaN(value - 0)) {
    return 'Invalid input type';
  }
  let str = '';
  return String(value).split('').forEach(num => {
    str += engToBnNumber(num);
  }), str;
}

export function getStorage(key: string): any {
  if (typeof window === 'undefined') return null;
  const data = localStorage?.getItem(key);
  if (!data) return;
  try {
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
  return null;
}

export function setStorage(key: string, value: any): void {
  if (typeof window === 'undefined') return;
  localStorage?.setItem(key, JSON.stringify(value));
}

export async function prayerApi(): Promise<Response> {
  return fetch('https://services.prothomalo.com/api/prayer-time?v=1');
}