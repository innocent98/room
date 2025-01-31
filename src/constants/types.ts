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

export type Settings = {
  general: {
    title: string;
    description: string;
    customUrl: string;
    theme: string;
  };
  responseCollection: {
    isOpen: boolean;
    responseLimit: number | any;
    startDate: Date | any;
    endDate: Date | any;
  };
  privacyPermissions: {
    whoCanSubmit: string;
    allowMultipleSubmissions: boolean;
    enableCaptcha: boolean;
  };
  notifications: { webhookUrl: string; emailNotifications: boolean };
};
