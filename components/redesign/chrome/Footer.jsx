import Glyph from '../Glyph';
import Icon3D from '../Icon3D';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

/*
 * Footer. Brand and promise, three link columns, and a bottom bar with the
 * copyright and a back-to-top button.
 */
export default function Footer({ copy, sections, onNavigate }) {
  const f = copy.footer;
  const go = (id) => (e) => {
    e.preventDefault();
    onNavigate(id);
  };
  return (
    <footer className="j13-footer">
      <div className="j13-container">
        <div className="j13-footer__grid">
          <div className="j13-footer__brand">
            <Logo />
            <p>{f.about}</p>
            <Button href="#contact" size="md" onClick={go('contact')}>
              {copy.ui.startProject}
            </Button>
          </div>
          <nav className="j13-footer__col" aria-label={f.explore}>
            <h2>{f.explore}</h2>
            <ul>
              {sections.slice(1).map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="j13-navlink" onClick={go(s.id)}>
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="j13-footer__col">
            <h2>{f.services}</h2>
            <ul>
              {copy.services.items.map((s) => (
                <li key={s.key}>
                  <a href="#services" className="j13-navlink" onClick={go('services')}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="j13-footer__col">
            <h2>{f.contact}</h2>
            <ul>
              {copy.contact.channels.map((ch) => (
                <li key={ch.label}>
                  {ch.href ? (
                    <a href={ch.href} className="j13-navlink" dir={ch.ltr ? 'ltr' : undefined}>
                      {ch.value}
                    </a>
                  ) : (
                    <span>{ch.value}</span>
                  )}
                </li>
              ))}
            </ul>
            <ul className="j13-socials" aria-label={f.follow}>
              {f.socials.map((so) => (
                <li key={so.key}>
                  {so.href ? (
                    <a href={so.href} target="_blank" rel="noopener noreferrer" aria-label={so.label}>
                      <Icon3D name={so.icon} size={26} />
                    </a>
                  ) : (
                    <span title={so.label}>
                      <Icon3D name={so.icon} size={26} alt={so.label} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="j13-footer__bar">
          <p>{f.copyright}</p>
          <p>{f.made}</p>
          <Button variant="icon" size="md" label={copy.ui.backToTop} icon={<Glyph name="up" size={18} />} onClick={() => onNavigate('top')} />
        </div>
      </div>
    </footer>
  );
}
