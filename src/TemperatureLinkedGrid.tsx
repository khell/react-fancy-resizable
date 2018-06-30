import React from 'react';
import ExternalTemperatureDisplay from './ExternalTemperatureDisplay';
import FancyPropLinkedDraggableGrid from './FancyPropLinkedDraggableGrid';
import TemperatureDisplay from './TemperatureDisplay';
import './polyfill';

export interface Props {
  setpoints?: Setpoint[];
  width: number;
  displayUnit?: 'C' | 'F';
  onSetpointChange(setpoints: Setpoint[]): void;
}

export interface Setpoint extends TemperatureRange {
  lowThreshold: number;
  highThreshold: number;
}

interface TemperatureRange {
  specialType?: 'GAP';
  lowTemperature: number;
  highTemperature: number;
  lowThreshold?: number;
  highThreshold?: number;
}

interface State {
  selectedRangeIndex?: number;
  accumulatedDelta: number;
  temperatures: TemperatureRange[];
  widths: number[];
}

export default class TemperatureLinkedGrid extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    displayUnit: 'C',
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const temperatures = TemperatureLinkedGrid.getTemperaturesAndGapsFromSetpoints(props.setpoints);
    return {
      ...state,
      temperatures,
      widths: TemperatureLinkedGrid.getWidthsFromTemperatureRange(props.width, temperatures)
    };
  }

  static getTemperaturesAndGapsFromSetpoints = (setpoints: Setpoint[]): TemperatureRange[] => {
    return setpoints.flatMap((current, i, a) => {
      const next = a[i + 1];
      if (next && current.highTemperature !== next.lowTemperature) {
        return [current, {
          specialType: 'GAP',
          lowTemperature: current.highTemperature,
          highTemperature: next.lowTemperature
        } as TemperatureRange];
      }
      return [current];
    });
  }

  static getWidthsFromTemperatureRange = (totalWidth: number, temperatures: TemperatureRange[]) => {
    const convertToWidth = (t1: number, t2: number) => Math.abs(t1 - t2) / absoluteRange * totalWidth;
    const absoluteRange = Math.abs(temperatures[0].lowTemperature) +
      Math.abs(temperatures[temperatures.length - 1].highTemperature);

    return temperatures.map((e, i, a) =>
      convertToWidth(e.lowTemperature, e.highTemperature)
    );
  }

  static getSingleElementChange(temps: TemperatureRange[], delta: number, elementId: number, isLower: boolean) {
    return temps.map((e, i) => i === elementId ? {
      ...e,
      lowTemperature: isLower ? e.lowTemperature + delta : e.lowTemperature,
      highTemperature: !isLower ? e.highTemperature + delta : e.highTemperature
    } : e);
  }

  static getElementWithAdjacentChange(temps: TemperatureRange[], delta: number, elementId: number, isLower: boolean) {
    const targetAdjusted = TemperatureLinkedGrid.getSingleElementChange(temps, delta, elementId, isLower);
    return TemperatureLinkedGrid.getSingleElementChange(
      targetAdjusted, delta, isLower ? elementId - 1 : elementId + 1, !isLower
    );
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      accumulatedDelta: 0,
      temperatures: [],
      widths: []
    };
  }

  onResizeNotify = (elementId: number, deltaX: number, isLower?: boolean) => {
    const accumulatedDelta = this.state.accumulatedDelta + deltaX;
    if (Math.abs(accumulatedDelta) < 4) {
      this.setState(prevState => ({ ...prevState, accumulatedDelta }));
      return;
    } else {
      this.setState(prevState => ({ ...prevState, accumulatedDelta: 0 }));
    }

    const temperatureDelta = accumulatedDelta < 0 ? -0.5 : 0.5;
    const { onSetpointChange } = this.props;
    const { temperatures } = this.state;
    const adjacentElementId = isLower ? elementId - 1 : elementId + 1;
    const adjacentElement = temperatures[adjacentElementId];

    let finalSetpoint;
    let ignoreDrag: boolean;
    // TODO: Populate this argument to support extending minimum and maximum range
    if (isLower !== undefined && elementId === 0 || elementId === temperatures.length - 1) {
      finalSetpoint = TemperatureLinkedGrid.getSingleElementChange(
        temperatures, temperatureDelta, elementId, isLower
      );
    } else if (adjacentElement.specialType !== 'GAP') {
      finalSetpoint = TemperatureLinkedGrid.getElementWithAdjacentChange(
        temperatures, temperatureDelta, elementId, isLower
      );
      ignoreDrag = temperatureDelta > 0 ?
        finalSetpoint[elementId].highTemperature === finalSetpoint[adjacentElementId].highTemperature :
        finalSetpoint[elementId].highTemperature === finalSetpoint[elementId].lowTemperature;
    } else {  // Adjacent element is a gap, we can potentially eliminate it
      // Not necessary to resize a gap, as this is not a real element
      finalSetpoint = TemperatureLinkedGrid.getSingleElementChange(
        temperatures, temperatureDelta, elementId, isLower
      );
      ignoreDrag = temperatureDelta < 0 &&
       finalSetpoint[elementId].highTemperature === finalSetpoint[elementId].lowTemperature;
    }

    if (!ignoreDrag) {
      onSetpointChange(finalSetpoint.filter(e => e.specialType !== 'GAP') as Setpoint[]);
    }
  }

  onClickNotify = (selectedRangeIndex: number) => {
    this.setState({ selectedRangeIndex });
  }

  renderTemperaturesExternal = (isTop: boolean) => {
    const { displayUnit } = this.props;
    const temperatures = this.state.temperatures.slice(0);
    temperatures.splice(-1, 1);
    const widths = this.state.widths;
    return temperatures
      .map((e, i) => (
        <ExternalTemperatureDisplay
          key={i}
          displayUnit={displayUnit}
          offset={widths.reduce((prev, curr, idx) => idx > i ? prev : prev + curr)}
        >
          {e.highTemperature}
        </ExternalTemperatureDisplay>
      ))
      .filter((e, i) => isTop ? i % 2 === 0 : i % 2 !== 0);
  }

  renderTemperatureInternalThreshold = () => {
    const { selectedRangeIndex, temperatures } = this.state;

    return temperatures.map((e, i) => {
      if (e.specialType === 'GAP') {
        return <div key={i} className="TemperatureDisplay BlankCheckeredPattern" />;
      } else if (i === selectedRangeIndex) {
        return <TemperatureDisplay key={i} lowValue={e.lowThreshold} highValue={e.highThreshold} />;
      }
      return undefined;
    });
  }

  render() {
    const { displayUnit } = this.props;
    const { widths, temperatures } = this.state;
    return (
      <div className="TemperatureLinkedGrid">
        <ExternalTemperatureDisplay displayUnit={displayUnit}>
          {temperatures[0].lowTemperature}
        </ExternalTemperatureDisplay>
        <div className="Grid">
          <div className="LabelGroup">
            {this.renderTemperaturesExternal(true)}
          </div>
          <FancyPropLinkedDraggableGrid
            widths={widths}
            stepWidth={1}
            onResizeNotify={this.onResizeNotify}
            onClickNotify={this.onClickNotify}
            selectedIndex={this.state.selectedRangeIndex}
          >
            {this.renderTemperatureInternalThreshold()}
          </FancyPropLinkedDraggableGrid>
          <div className="LabelGroup">
            {this.renderTemperaturesExternal(false)}
          </div>
        </div>
        <ExternalTemperatureDisplay displayUnit={displayUnit}>
          {temperatures[temperatures.length - 1].highTemperature}
        </ExternalTemperatureDisplay>
      </div>
    );
  }
}
