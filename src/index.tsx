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
  temperature: -40
}, {
  lowThreshold: -65,
  highThreshold: -19,
  temperature: -20
}, {
  lowThreshold: -41,
  highThreshold: 5,
  temperature: 0
}, {
  lowThreshold: 6,
  highThreshold: 25,
  temperature: 20
}];

class ComponentWithInternalState extends React.Component<{}, State> {
  state: State = {
    setpoints
  };

  render() {
    return (
      <TemperatureLinkedGrid
        minimumTemperature={-60}
        maximumTemperature={20}
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
  <ComponentWithInternalState />,
  document.getElementById('app')
);
