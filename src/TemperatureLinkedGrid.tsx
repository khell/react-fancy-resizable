import React from 'react';
import FancyLinkedDraggableGrid from './FancyLinkedDraggableGrid';

export interface Props {
  minimumTemperature: number;
  maximumTemperature: number;
  count: number;
  width: number;
}

interface State {
  temperatures: number[];
}

export default class TemperatureLinkedGrid extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { width, count } = props;
    const pixelsPerDegree = this.getPixelsPerDegree();

    this.state = {
      temperatures: [...Array(count)].map(() => width / count / pixelsPerDegree)
    };
  }

  getTemperatureRange = () => Math.abs(this.props.minimumTemperature) + Math.abs(this.props.maximumTemperature);
  getPixelsPerDegree = () => this.props.width / this.getTemperatureRange();

  onResizeNotify = (newWidths: number[]) => {
    const pixelsPerDegree = this.getPixelsPerDegree();
    this.setState({
      temperatures: newWidths.map(width => width / pixelsPerDegree)
    });
  }

  renderTemperatures = () => {
    const {
      minimumTemperature,
      maximumTemperature,
      count,
      width
    } = this.props;

    const range = this.getTemperatureRange();
    const pixelsPerDegree = this.getPixelsPerDegree();

    return this.state.temperatures.map((e, i) => <div key={i}>{e}</div>);
  }

  render() {
    const { width, count } = this.props;
    return (
      <FancyLinkedDraggableGrid width={width} count={count} onResizeNotify={this.onResizeNotify}>
        {this.renderTemperatures()}
      </FancyLinkedDraggableGrid>
    );
  }
}
