import React from 'react';
import { cToF } from './lib';

export interface Props {
  displayUnit?: 'C' | 'F';
  lowValue: number;
  highValue: number;
}

export default function TemperatureDisplay(props: Props) {
  const { displayUnit: displayUnitProp, lowValue, highValue } = props;
  const displayUnit = displayUnitProp || 'C';
  const toCorrectUnit = (value: number) => displayUnit === 'F' ? cToF(value).toFixed(2) : value.toFixed(1);
  
  return (
    <div className="TemperatureDisplay">
      <div className="Low">{toCorrectUnit(lowValue)}°{displayUnit} Low</div>
      <div className="High">{toCorrectUnit(highValue)}°{displayUnit} High</div>
    </div>
  );
}
