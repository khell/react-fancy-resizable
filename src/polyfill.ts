import flatMap from 'array.prototype.flatmap';

declare global {
  interface Array<T> {
    flatMap<E>(callback: (currentValue: T, index: number, array: T[]) => E[]): E[];
  }
}

flatMap.shim();
