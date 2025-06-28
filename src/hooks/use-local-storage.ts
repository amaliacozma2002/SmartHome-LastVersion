"use client";

import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Lazy initializer: citim din localStorage o singură dată, la montarea componentelor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      // În SSR nu avem window → folosim valoarea inițială
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("useLocalStorage read error:", error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitem și forma funcțională a setter-ului, ca în useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Actualizăm starea locală
      setStoredValue(valueToStore);

      // Persistăm în localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("useLocalStorage write error:", error);
    }
  };

  return [storedValue, setValue];
}
