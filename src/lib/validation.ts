export function validateRequired(value: any, fieldName: string): string | undefined {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return `Le champ "${fieldName}" est obligatoire.`;
  }
  return undefined;
}

export function validateMinNumber(value: number | undefined, min: number, fieldName: string): string | undefined {
  if (value !== undefined && value < min) {
    return `Le champ "${fieldName}" doit être supérieur ou égal à ${min}.`;
  }
  return undefined;
}
