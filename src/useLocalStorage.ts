import {useEffect, useMemo, useRef, useState} from "react";

type StorageWrapper = {
  storageGet: <T>(key: string) => T | null;
  storageSet: <T>(key: string, item: T) => boolean;
  storageRemove: (key: string) => boolean;
};

const getStorage = (storageGetter: () => Storage): StorageWrapper => {
  let storage: Storage;
  try {
    storage = storageGetter();
  } catch {
    return {
      storageGet() {
        return null;
      },
      storageSet() {
        return false;
      },
      storageRemove() {
        return false;
      },
    };
  }

  return {
    storageGet(key) {
      try {
        const content = storage.getItem(key);
        return content ? JSON.parse(content) : null;
      } catch (e) {
        return null;
      }
    },

    storageSet(key, val) {
      try {
        storage.setItem(key, JSON.stringify(val));
        return true;
      } catch (e) {
        return false;
      }
    },

    storageRemove(key) {
      try {
        storage.removeItem(key);
        return true;
      } catch (e) {
        return false;
      }
    },
  };
};

export const storageWrapper = getStorage(() => window.localStorage);

const getStorageValOrDefaultWithKey = <T>(
  key: string,
  defaultVal: T
): {key: string; value: T | null} => {
  if (!key) return {key, value: null};
  const storageVal = storageWrapper.storageGet<T>(key);
  const value = storageVal === null ? defaultVal : storageVal;
  return {key, value};
};

/**
 * sample usage:
 * const [val, setVal] = useLocalStorage('my-storage-key')
 *
 * full example:
 * const [val, setVal, {clear}] = useLocalStorage('my-storage-key', [defaultValueIfStorageHasNoValueYet])
 *
 */
export const useLocalStorageState = <T>(key: string, defaultVal: T) => {
  // `data` contains both the current key and the value. The `key` is stored to allow
  // reacting immediately in case the key passed in above has changed. (rather than having to wait for an e.g. `useEffect`)
  const [data, setData] = useState(() => getStorageValOrDefaultWithKey(key, defaultVal));

  // nextVal is a fallback only used when the key changes so we can immediately pass the `key`'s real value
  let nextVal = null;

  // if the passed key differs from the last seen key, update the data immediately
  if (key !== data.key) {
    nextVal = getStorageValOrDefaultWithKey(key, defaultVal);
    setData(nextVal);
  }

  // create a reference of the passed `defaultVal`. This allows the `useMemo` below to access the defaultVal
  // without having to add it to the dependency array. (Otherwise calling e.g. `useLocalStorageState('key', [])`)
  // would result in not really memoizing the handlers below as the `[]` is always a new array different from the
  // one passed in before.
  const defaultValueRef = useRef(defaultVal);
  useEffect(() => {
    defaultValueRef.current = defaultVal;
  }, [defaultVal]);

  // memoize `setVal` as setters are expected to not change in hooks.
  const handlers = useMemo(
    () => ({
      setVal: (next: T) => {
        storageWrapper.storageSet(key, next);
        setData({key, value: next});
      },
    }),
    [key]
  );

  return [(nextVal ? nextVal.value : data.value) as T, handlers.setVal] as const;
};
