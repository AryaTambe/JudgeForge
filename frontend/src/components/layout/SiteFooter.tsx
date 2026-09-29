export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner page-frame">
        <p className="site-footer__brand">DOGFOOD <span>2026</span></p>
        <p className="site-footer__note">Public event preview · sample fixture projects are not live submissions.</p>
        <a href="https://dogfoodhack.com/spec" target="_blank" rel="noreferrer">
          Official challenge spec <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
