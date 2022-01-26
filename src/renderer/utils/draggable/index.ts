import type { DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';

export function reorder<T>(
  list: Iterable<T> | ArrayLike<T>,
  startIndex: number,
  endIndex: number
) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  userSelects: 'none',
  padding: '2px 0',
  filter: `opacity(${isDragging ? 0.5 : 1})`,
  ...draggableStyle,
});
