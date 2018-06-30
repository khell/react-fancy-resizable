import React from 'react';
import ReactDOM from 'react-dom';
import TemperatureLinkedGrid, { Setpoint } from './TemperatureLinkedGrid';
import './FancyResizable.scss';

interface State {
  setpoints: Setpoint[];
}

const setpoints: Setpoint[] = [{
  lowThreshold: -80,
  highThreshold: -59,
  lowTemperature: -60,
  highTemperature: -40
}, {
  lowThreshold: -65,
  highThreshold: -19,
  lowTemperature: -25,
  highTemperature: -20
}, {
  lowThreshold: -41,
  highThreshold: 5,
  lowTemperature: -20,
  highTemperature: 0
}, {
  lowThreshold: 6,
  highThreshold: 25,
  lowTemperature: 0,
  highTemperature: 20
}];

class ComponentWithInternalState extends React.Component<{}, State> {
  state: State = {
    setpoints
  };

  render() {
    return (
      <TemperatureLinkedGrid
        setpoints={this.state.setpoints}
        width={1000}
        onSetpointChange={setpoints => {
          this.setState(prevState => ({ ...prevState, setpoints }));
        }}
      />
    );
  }
}

ReactDOM.render(
  <ComponentWithInternalState /> as any,
  document.getElementById('app')
);
