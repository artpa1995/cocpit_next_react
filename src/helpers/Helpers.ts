
export function setItemWithExpiration(key: string, value: any, days: number): void {
    const now = new Date();
    const expirationTime = now.getTime() + days * 24 * 60 * 60 * 1000;
    const item = {
      value: value,
      expiration: expirationTime,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
  
  
export function getItemWithExpiration(key: string): any {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      if (!item) return null;
  
      try {
        const parsedItem = JSON.parse(item);
        const now = new Date().getTime();
  
        if (now > parsedItem.expiration) {
          localStorage.removeItem(key);
          return null;
        }
  
        return parsedItem.value;
      } catch (e) {
        console.error('Error parsing item from localStorage', e);
        return null;
      }
    }
    return null;
  }
  