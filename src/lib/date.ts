import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(dateString: string, formatStr: string = 'dd MMMM yyyy à HH:mm'): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr, { locale: fr });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  } catch {
    return dateString;
  }
}

export function getNowISO(): string {
  return new Date().toISOString();
}

export function formatTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'HH:mm', { locale: fr });
  } catch {
    return '';
  }
}
