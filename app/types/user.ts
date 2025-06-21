export interface InfoItem {
  label: string;
  value: string;
}

export type AlertType = 'info' | 'success' | 'error';

export interface AlertItem {
  id?: string | number;
  type: AlertType;
  title: string;
  description?: string;
}

export interface UserProfileData {
  name: string;
  avatarUrl?: string;
  initials: string;
  info: InfoItem[];
  phone?: string;
  whatsapp?: string;
  email?: string;
  tags?: string[];
  alerts?: AlertItem[];
}
