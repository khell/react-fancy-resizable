import React from 'react';

type DragEvent = React.DragEvent<HTMLDivElement>;

export interface Props {
  width: number;
  onResizeStart(e: DragEvent): void;
  onResizeStop(e: DragEvent): void;
  onResizeTick(e: DragEvent): void;
}

export default function FancyDraggableHandler(props: Props) {
  return (
    <div
      className="FancyDraggableHandler"
      draggable={true}
      onDragStart={props.onResizeStart}
      onDragEnd={props.onResizeStop}
      onDrag={props.onResizeTick}
      style={{left: `${props.width}px`}}
    >
      <div className="Handle" />
    </div>
  );
}