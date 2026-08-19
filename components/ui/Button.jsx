'use client'

export default function Button({ children, variant = 'primary', size = 'md', href, onClick, disabled, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const variants = {
    primary: 'bg-[color:var(--primary)] text-white hover:-translate-y-0.5 hover:shadow-lg',
    ghost: 'border border-[color:var(--border)] text-[color:var(--text)] hover:-translate-y-0.5',
    accent: 'bg-[color:var(--accent)] text-white hover:-translate-y-0.5 hover:shadow-lg',
    muted: 'bg-[color:var(--surface)] text-[color:var(--muted)] hover:text-[color:var(--text)]',
  }

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`

  if (href) {
    return <a href={href} className={classes} {...props}>{children}</a>
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  )
}
