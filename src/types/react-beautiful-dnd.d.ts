
declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  export type DraggableId = string;
  export type DroppableId = string;
  export type TypeId = string;
  export type DraggableRubric = {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
  };
  
  export type DroppableRubric = {
    droppableId: DroppableId;
    type: TypeId;
  };
  
  export type DraggableLocation = {
    droppableId: DroppableId;
    index: number;
  };
  
  export type DraggableStateSnapshot = {
    isDragging: boolean;
    draggingOver?: DroppableId;
  };
  
  export type DroppableStateSnapshot = {
    isDraggingOver: boolean;
    draggingOverWith?: DraggableId;
  };
  
  export type DraggableProvided = {
    draggableProps: {
      style?: React.CSSProperties;
      'data-rbd-draggable-context-id': string;
      'data-rbd-draggable-id': string;
      onTransitionEnd?: (event: React.TransitionEvent<any>) => void;
    };
    dragHandleProps: {
      role: string;
      'aria-grabbed': boolean;
      tabIndex: number;
      'data-rbd-drag-handle-draggable-id': string;
      'data-rbd-drag-handle-context-id': string;
      draggable: boolean;
      onDragStart: (event: React.DragEvent<any>) => void;
    } | null;
    innerRef: (element?: HTMLElement | null) => void;
  };
  
  export type DroppableProvided = {
    innerRef: (element?: HTMLElement | null) => void;
    droppableProps: {
      'data-rbd-droppable-context-id': string;
      'data-rbd-droppable-id': string;
    };
    placeholder?: React.ReactElement | null;
  };
  
  export type DropResult = {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
    destination?: DraggableLocation;
    reason: 'DROP' | 'CANCEL';
  };
  
  export type DragStart = {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
  };
  
  export type DragUpdate = DragStart & {
    destination?: DraggableLocation;
  };
  
  export type DragDropContextProps = {
    onDragStart?: (start: DragStart) => void;
    onDragUpdate?: (update: DragUpdate) => void;
    onDragEnd: (result: DropResult) => void;
    children: React.ReactNode;
  };
  
  export type DraggableProps = {
    draggableId: DraggableId;
    index: number;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode;
  };
  
  export type DroppableProps = {
    droppableId: DroppableId;
    type?: TypeId;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode;
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
  };
  
  export const DragDropContext: React.ComponentClass<DragDropContextProps>;
  export const Droppable: React.ComponentClass<DroppableProps>;
  export const Draggable: React.ComponentClass<DraggableProps>;
}
