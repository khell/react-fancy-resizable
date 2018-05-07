import React from 'react';
import FancyResizable from './FancyResizable';
import './FancyResizable.scss';

export interface Props {
  width: number;
  count: number;
  children: React.ReactNode[];
  onResizeNotify(widths: number[]): void;
}

interface State {
  resizables: ResizableState[];
}

interface ResizableState {
  width: number;
}

export default class FancyLinkedDraggableGrid extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
    const { width, count } = nextProps;
    this.state = {
      resizables: [...Array(count)].map(() => ({ width: width / count }))
    };
  }

  onResizeStart = (idx: number) => {
    return true;
  }

  onResizeMotion = (idx: number, deltaX: number) => {
    const thisElement = this.state.resizables[idx];
    const nextElement = this.state.resizables[idx + 1];
    if (!nextElement || nextElement.width - deltaX < 10 || thisElement.width + deltaX < 10) {
      return;
    }

    this.setState(prevState => ({
      ...prevState,
      resizables: prevState.resizables.map((e, i) => {
        if (idx === i) {
          return {
            ...e,
            width: e.width + deltaX
          };
        } else if (idx + 1 === i) {
          return {
            ...e,
            width: e.width - deltaX
          };
        }
        return e;
      })
    }), () => this.props.onResizeNotify(this.state.resizables.map(e => e.width)));
  }

  onResizeStop = (idx: number) => {
   return; 
  }

  render() {
    const { width, children } = this.props;
    return (
      <div className="FancyLinkedDraggableGrid" style={{ width }}>
        {this.state.resizables.map((e, i) => 
          <FancyResizable
            key={i}
            width={e.width}
            onResizeStart={this.onResizeStart.bind(this, i)}
            onResizeMotion={this.onResizeMotion.bind(this, i)}
            onResizeStop={this.onResizeStop.bind(this, i)}
          >
            {children[i]}
          </FancyResizable>
        )}
      </div>
    );
  }
}