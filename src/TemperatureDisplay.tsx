import React from 'react';
import { cToF } from './lib';

export interface Props {
  displayUnit: 'C' | 'F';
  lowValue: number;
  highValue: number;
}

export default function TemperatureDisplay(props: Props) {
  const { displayUnit, lowValue, highValue } = props;
  const toCorrectUnit = (value: number) => displayUnit === 'F' ? cToF(value).toFixed(2) : value.toFixed(1);
  
  return (
    <div className="TemperatureDisplay">
      <div className="Low">{toCorrectUnit(lowValue)}°{displayUnit}</div>
      <div className="High">{toCorrectUnit(highValue)}°{displayUnit}</div>
    </div>
  );
}
