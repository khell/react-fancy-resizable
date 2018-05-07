import React from 'react';
import FancyDraggableHandler from './FancyDraggableHandler';
import './FancyResizable.scss';

export interface Props {
  children: React.ReactNode;
  width: number; 
  onResizeStart(): boolean;
  onResizeMotion(deltaX: number): void;
  onResizeStop(): void;
  onClick?(): void;
}

export interface State {
  resizing: boolean;
  lastStartX: number;
}

export default class FancyResizable extends React.Component<Props, State> {
  state: State = {
    resizing: false,
    lastStartX: -1
  };

  onResizeStart = (e: React.DragEvent<HTMLDivElement>) => {
    const { onResizeStart, onClick } = this.props;
    if (onResizeStart()) {
      const emptyImage = new Image(0, 0);
      emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      e.dataTransfer.setDragImage(emptyImage, 0, 0);
     
      const startX = e.clientX;  // copy value before callback and event is destroyed
      this.setState(prevState => ({
        ...prevState, 
        resizing: true,
        lastStartX: startX
      }));

      if (onClick) {
        onClick();
      }
    }
  }

  onResizeStop = () => {
    this.props.onResizeStop();
    this.setState(prevState => ({ ...prevState, resizing: false }));
  }

  onResize = (e: React.DragEvent<HTMLDivElement>) => {
    const { lastStartX, resizing } = this.state;
    const finishX = e.clientX;
    const deltaX = finishX - lastStartX;
    if (resizing && finishX !== 0 && deltaX !== 0) {
      this.props.onResizeMotion(deltaX);
      this.setState(prevState => ({
        ...prevState,
        lastStartX: finishX 
      }));
    }
  }

  render() {
    const { width, onClick } = this.props;
    return (
      <div
        className="FancyResizable"
        style={{ width }}
        onClick={onClick}
      >
        {this.props.children}
        <FancyDraggableHandler
          width={width}
          onResizeStart={this.onResizeStart}
          onResizeStop={this.onResizeStop}
          onResizeTick={this.onResize}
        />
      </div>
    );
  }
}
