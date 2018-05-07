import React from 'react';
import { cToF } from './lib';

export interface Props {
  displayUnit: 'C' | 'F';
  children: number;
  offset?: number;
}

export default function ExternalTemperatureDisplay(props: Props) {
  const { displayUnit, children: value, offset } = props;
  const toCorrectUnit = (v: number) => displayUnit === 'F' ? cToF(value).toFixed(2) : value.toFixed(1);
  return (
    <div className="ExternalTemperatureDisplay" style={{ left: offset }}>
      {toCorrectUnit(value)}°{displayUnit}
    </div>
  );
}
