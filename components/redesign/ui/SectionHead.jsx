/*
 * The heading block every section opens with: numbered eyebrow, title, lead.
 * `align` is "start" (default) or "split" (title and lead side by side).
 */
export default function SectionHead({ index, eyebrow, title, lead, id, align = 'start', children }) {
  return (
    <header className={`j13-head j13-head--${align}`}>
      <div className="j13-head__main">
        <p className="j13-eyebrow" data-reveal="up">
          <span className="j13-eyebrow__num">{String(index).padStart(2, '0')}</span>
          <span className="j13-eyebrow__bar" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 id={id} className="j13-h2" data-reveal="lines">
          {title}
        </h2>
      </div>
      {lead || children ? (
        <div className="j13-head__side" data-reveal="up">
          {lead ? <p className="j13-lead">{lead}</p> : null}
          {children}
        </div>
      ) : null}
    </header>
  );
}
