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

export interface Field {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  description?: string;
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  disabled?: boolean;
}

export interface Form {
  id: string;
  title: string;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
  isDraft: boolean;
  description?: string;
  settings?: FormSettings;
}

export interface FormSettings {
  showProgressBar?: boolean;
  allowMultipleSubmissions?: boolean;
  confirmationMessage?: string;
  redirectUrl?: string;
  emailNotifications?: boolean;
  notificationEmails?: string[];
  customTheme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  fields: Field[];
}
