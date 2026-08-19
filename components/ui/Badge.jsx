export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: { background: 'var(--overlay)', color: 'var(--primary)' },
    success: { background: 'var(--success)22', color: 'var(--success)' },
    warning: { background: 'var(--warning)22', color: 'var(--warning)' },
    error: { background: 'var(--error)22', color: 'var(--error)' },
    accent: { background: 'var(--accent)22', color: 'var(--accent)' },
  }

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${className}`}
      style={variants[variant]}
    >
      {children}
    </span>
  )
}
