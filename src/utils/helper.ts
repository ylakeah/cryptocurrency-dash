export function formatCurrency(value: string | number | undefined): string {
    if (!value) return '';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(typeof value === 'string' ? parseFloat(value) : value);
  }