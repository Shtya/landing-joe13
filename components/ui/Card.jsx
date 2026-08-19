export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`rounded-2xl p-6 ${hover ? 'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer' : ''} ${className}`}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
      {...props}
    >
      {children}
    </div>
  )
}
