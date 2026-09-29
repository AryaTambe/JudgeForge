import Image from "next/image";
import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="public-header">
      <Link className="public-brand" href="/" aria-label="DOGFOOD 2026 home">
        <Image src="/dogfood-mark.png" alt="" width={36} height={36} priority unoptimized />
        <span><strong>DOGFOOD</strong><small>PORTAL / 2026</small></span>
      </Link>
      <nav className="public-nav" aria-label="Main navigation">
        <Link href="/projects">Project gallery</Link>
        <a href="https://dogfoodhack.com/spec/" target="_blank" rel="noreferrer">Event spec <span aria-hidden="true">↗</span></a>
      </nav>
      <div className="public-header__actions">
        <Link className="button button--quiet" href="/register">Sign up</Link>
        <Link className="button button--quiet" href="/login">Sign in <span aria-hidden="true">→</span></Link>
      </div>
    </header>
  );
}
