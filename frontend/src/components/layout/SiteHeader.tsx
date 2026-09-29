import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner page-frame">
        <Link className="brand-lockup" href="/" aria-label="DOGFOOD 2026 home">
          <Image
            className="brand-lockup__mark"
            src="/dogfood-mark.png"
            alt=""
            width={44}
            height={44}
            priority
            unoptimized
          />
          <span className="brand-lockup__text">
            <span className="brand-lockup__name">DOGFOOD<span aria-hidden="true">®</span></span>
            <span className="brand-lockup__descriptor">2026 HACKATHON PORTAL</span>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#event">The event</a>
          <a href="#projects">Projects</a>
          <a href="https://dogfoodhack.com/spec" target="_blank" rel="noreferrer">
            Challenge spec <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
