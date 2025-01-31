export type Field = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  options: string[];
  required?: boolean;
  disabled?: boolean;
};

export type UndoableState = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};
