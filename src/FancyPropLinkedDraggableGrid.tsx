import React from 'react';
import FancyResizable from './FancyResizable';
import './FancyResizable.scss';

export interface Props {
  /**
   * The widths of the component.
   */
  widths: number[];
  children?: React.ReactNode[];
  /** 
   * Controls the minimum width that the underlying FancyResizable can be sized to.
   * The minimum width is excluded from the calculation reported on a resize.
   * 
   * Default: 67px
   */
  minimumResizableWidth?: number;
  /**
   * The amount of width change for a resize event to trigger.
   * Default: 1px
   */
  stepWidth?: number;
  selectedIndex?: number;
  onResizeNotify(elementId: number, deltaX: number): void;
  onClickNotify?(elementId: number): void;
}

export default class FancyPropLinkedDraggableGrid extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    minimumResizableWidth: 0,
    stepWidth: 1
  };

  onResizeStart = (idx: number) => {
    return true;
  }

  onResizeMotion = (idx: number, deltaX: number) => {
    const stepWidthDeltaX = deltaX / this.props.stepWidth;
    if (Math.abs(stepWidthDeltaX) >= 1) {
      this.props.onResizeNotify(idx, stepWidthDeltaX);
    }
  }

  onResizeStop = (idx: number) => {
    return; 
  }

  render() {
    const { widths, children, onClickNotify, selectedIndex } = this.props;
    const totalWidth = widths.reduce((p, c) => p + c);
    return (
      <div className="FancyLinkedDraggableGrid" style={{ width: totalWidth }}>
        {widths.map((e, i) => 
          <FancyResizable
            key={i}
            width={e}
            selected={i === selectedIndex}
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