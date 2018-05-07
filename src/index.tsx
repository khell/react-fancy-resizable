import React from 'react';
import ReactDOM from 'react-dom';
import TemperatureLinkedGrid from './TemperatureLinkedGrid';
import './FancyResizable.scss';

ReactDOM.render(
  <TemperatureLinkedGrid
    minimumTemperature={-60}
    maximumTemperature={20}
    count={4}
    width={1000}
  >
    Hello
  </TemperatureLinkedGrid>,
  document.getElementById('app')
);
