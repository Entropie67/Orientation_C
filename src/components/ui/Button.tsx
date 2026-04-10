import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 hover:border-blue-400 shadow-sm',
  ghost: 'text-slate-500 hover:text-slate-700 hover:bg-slate-100',
};
const sizeClasses = { sm: 'px-4 py-2 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' };

export function Button({ variant = 'primary', size = 'md', fullWidth, className = '', children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center font-semibold rounded-xl
        transition-all duration-200 active:scale-[0.98] cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
