import React from 'react';
import FancyResizable from './FancyResizable';
import './FancyResizable.scss';

export interface Props {
  /**
   * The width of the component. Must be a discrete value to enable calculations to be made off its size.
   * TODO: Replace with relative sizing. It will be necessary to read from the DOM to determine sizing.
   */
  width: number;
  count: number;
  children?: React.ReactNode[];
  /** 
   * Controls the minimum width that the underlying FancyResizable can be sized to.
   * The minimum width is excluded from the calculation reported on a resize.
   * 
   * Default: 67px
   */
  minimumResizableWidth?: number;
  /**
   * Controls the amount of width change on a resize event.
   * Default: 1px
   */
  stepWidth?: number;
  onResizeNotify(widths: number[]): void;
  onClickNotify?(idx: number): void;
}

interface State {
  resizables: ResizableState[];
}

interface ResizableState {
  width: number;
}

export default class FancyLinkedDraggableGrid extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    minimumResizableWidth: 0,
    stepWidth: 1
  };

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
    const { minimumResizableWidth, stepWidth } = this.props;
    if (!nextElement ||
      nextElement.width - deltaX < minimumResizableWidth ||
      thisElement.width + deltaX < minimumResizableWidth) {
      return;
    }

    const stepDeltaX = deltaX * stepWidth; 
    this.setState(prevState => ({
      ...prevState,
      resizables: prevState.resizables.map((e, i) => {
        if (idx === i) {
          return {
            ...e,
            width: e.width + stepDeltaX
          };
        } else if (idx + 1 === i) {
          return {
            ...e,
            width: e.width - stepDeltaX
          };
        }
        return e;
      })
    }), () => this.props.onResizeNotify(this.state.resizables.map((e, i) => 
      e.width - this.props.minimumResizableWidth
    )));
  }

  onResizeStop = (idx: number) => {
   return; 
  }

  render() {
    const { width, children, onClickNotify } = this.props;
    return (
      <div className="FancyLinkedDraggableGrid" style={{ width }}>
        {this.state.resizables.map((e, i) => 
          <FancyResizable
            key={i}
            width={e.width}
            onResizeStart={this.onResizeStart.bind(this, i)}
            onResizeMotion={this.onResizeMotion.bind(this, i)}
            onResizeStop={this.onResizeStop.bind(this, i)}
            onClick={onClickNotify && onClickNotify.bind(undefined, i)}
          >
            {children && children[i]}
          </FancyResizable>
        )}
      </div>
    );
  }
}