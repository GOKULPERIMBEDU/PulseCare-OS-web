import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

const styles: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-teal text-white hover:opacity-90',
  secondary: 'bg-surface-2 text-foreground hover:bg-line',
  ghost: 'bg-transparent text-muted hover:bg-surface-2 hover:text-foreground',
  danger: 'bg-danger text-white hover:opacity-90',
};

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
