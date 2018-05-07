import React from 'react';
import ExternalTemperatureDisplay from './ExternalTemperatureDisplay';
import FancyPropLinkedDraggableGrid from './FancyPropLinkedDraggableGrid';
import TemperatureDisplay from './TemperatureDisplay';

export interface Props {
  minimumTemperature: number;
  maximumTemperature: number;
  setpoints?: Setpoint[];
  width: number;
  displayUnit?: 'C' | 'F';
  onSetpointChange(setpoints: Setpoint[]): void;
}

export interface Setpoint {
  lowThreshold: number;
  highThreshold: number;
  temperature: number;
}

interface State {
  // widths: number[];
  // temperatures: number[];
  selectedRangeIndex?: number;
}

export default class TemperatureLinkedGrid extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    displayUnit: 'C',
  };

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  getTemperatureRange = () => Math.abs(this.props.minimumTemperature) + Math.abs(this.props.maximumTemperature);
  getPixelsPerDegree = () => this.props.width / this.getTemperatureRange();

  buildTemperatures = (widths: number[]) => {
    const pixelsPerDegree = this.getPixelsPerDegree();
    let lastTemperature = this.props.minimumTemperature;
    return widths.map((width, index, array) => {
      lastTemperature += width / pixelsPerDegree;
      return lastTemperature;
    });
  }

  buildWidthsFromTemperatureRange = () => {
    const { minimumTemperature, maximumTemperature, setpoints, width: totalWidth } = this.props;
    const absoluteRange = Math.abs(minimumTemperature) + Math.abs(maximumTemperature);
    const convertToWidth = (t1: number, t2: number) => Math.abs(t1 - t2) / absoluteRange * totalWidth;
    return setpoints.map((e, i, a) =>
      convertToWidth(i === 0 ? minimumTemperature : a[i - 1].temperature, e.temperature)
    );
  }

  onResizeNotify = (elementId: number, deltaX: number) => {
    const temperatureDelta = deltaX < 0 ? -0.5 : 0.5; //Math.round(deltaX * 2) / 2;
    const { setpoints, minimumTemperature, maximumTemperature, onSetpointChange } = this.props;
    onSetpointChange(setpoints.map((e, i, a) => {
      if (i === elementId) {
        const newTemperature = e.temperature + temperatureDelta;
        const previousTemperature = i === 0 ? minimumTemperature : a[i - 1].temperature;
        const nextTemperature = i === a.length - 1 ? maximumTemperature : a[i + 1].temperature;
        const isTemperatureExceedsPrevious = deltaX < 0 && newTemperature < previousTemperature;
        const isTemperatureExceedsNext = deltaX > 0 && newTemperature > nextTemperature;
      
        if (!isTemperatureExceedsPrevious && !isTemperatureExceedsNext) {
          return {
            ...e,
            temperature: e.temperature + temperatureDelta
          };
        }
      }
      return e;
    }));
  }

  onClickNotify = (selectedRangeIndex: number) => {
    this.setState({ selectedRangeIndex });
  }

  /*renderTemperatures = () => {
    const {
      minimumTemperature,
      maximumTemperature,
      displayUnit
    } = this.props;

    return this.state.temperatures.map((e, i, a) => (
      <TemperatureDisplay
        key={i}
        lowValue={i === 0 ? minimumTemperature : a[i - 1]}
        highValue={i === this.state.temperatures.length - 1 ? maximumTemperature : e}
        displayUnit={displayUnit}
      />
    ));
  }*/

  renderTemperaturesExternal = (isTop: boolean) => {
    const { displayUnit } = this.props;
    const temperatures = this.props.setpoints.slice(0);
    temperatures.splice(-1, 1);
    const widths = this.buildWidthsFromTemperatureRange();
    return temperatures
      .map((e, i) => (
        <ExternalTemperatureDisplay
          key={i}
          displayUnit={displayUnit}
          offset={widths.reduce((prev, curr, idx) => idx > i ? prev : prev + curr)}
        >
          {e.temperature}
        </ExternalTemperatureDisplay>
      ))
      .filter((e, i) => isTop ? i % 2 === 0 : i % 2 !== 0);
  }

  renderTemperatureInternalThreshold = () => {
    const { selectedRangeIndex } = this.state;
    const { setpoints } = this.props;
    if (selectedRangeIndex === undefined) {
      return;
    }

    return setpoints.map((e, i) => i === selectedRangeIndex
      ? <div key={i}>selected</div>
      : undefined
    );
  }

  render() {
    const { minimumTemperature, maximumTemperature, displayUnit } = this.props;
    const widths = this.buildWidthsFromTemperatureRange();
    return (
      <div className="TemperatureLinkedGrid">
        <div className="LabelGroup">
          {this.renderTemperaturesExternal(true)}
        </div>
        <div className="Grid">
          <ExternalTemperatureDisplay displayUnit={displayUnit}>{minimumTemperature}</ExternalTemperatureDisplay>
          <FancyPropLinkedDraggableGrid
            widths={widths}
            stepWidth={3}
            onResizeNotify={this.onResizeNotify}
            onClickNotify={this.onClickNotify}
          >
            {this.renderTemperatureInternalThreshold()}
          </FancyPropLinkedDraggableGrid>
          <ExternalTemperatureDisplay displayUnit={displayUnit}>{maximumTemperature}</ExternalTemperatureDisplay>
        </div>
        <div className="LabelGroup">
          {this.renderTemperaturesExternal(false)}
        </div>
      </div>
    );
  }
}
