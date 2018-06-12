import React from 'react';
import { cToF } from './lib';

export interface Props {
  displayUnit: 'C' | 'F';
  children: number;
  offset?: number;
}

interface State {
  offsetWidth: number;
}

export default class ExternalTemperatureDisplay extends React.Component<Props, State> {
  private rootRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.rootRef = React.createRef();
    this.state = {
      offsetWidth: 0
    };
  }

  componentDidMount() {
    setTimeout(() => {  // componentDidMount can be executed before the real DOM has finished drawing
      const offsetWidth = this.rootRef.current.offsetWidth;
      this.setState(prevState => ({ ...prevState, offsetWidth }));
    }, 0);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const offsetWidth = this.rootRef.current.offsetWidth;
    if (prevState.offsetWidth !== offsetWidth) {
      this.setState({ offsetWidth });
    }
  }

  render() {
    const { displayUnit, children: value, offset: initialOffset } = this.props;
    const offset = initialOffset - this.state.offsetWidth / 2;
    const toCorrectUnit = (v: number) => displayUnit === 'F' ? cToF(value).toFixed(2) : value.toFixed(1);
    return (
      <div ref={this.rootRef} className="ExternalTemperatureDisplay" style={{ left: offset }}>
        {toCorrectUnit(value)}°{displayUnit}
      </div>
    );
  }
}
