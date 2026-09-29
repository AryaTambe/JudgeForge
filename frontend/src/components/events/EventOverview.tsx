const eventFacts = [
  { value: "$2,500", label: "Prize pool", detail: "Across the event" },
  { value: "72h", label: "Build sprint", detail: "Make it. Ship it." },
  { value: "26—29", label: "September 2026", detail: "Four-day event window" },
  { value: "Online", label: "Free to join", detail: "Open from anywhere" },
];

export function EventOverview() {
  return (
    <>
      <section className="event-hero" id="event" aria-labelledby="event-title">
        <div className="event-hero__copy">
          <p className="eyebrow event-hero__eyebrow">
            <span className="status-dot" aria-hidden="true" />
            DOGFOOD 2026 <span className="eyebrow-divider">/</span> ONLINE HACKATHON
          </p>
          <h1 id="event-title">
            The event portal
            <br />
            <span>is the real challenge.</span>
          </h1>
          <p className="event-hero__lede">
            Seventy-two hours to build the place where teams submit, judges review, and organizers keep the whole event moving.
          </p>
          <div className="event-hero__actions">
            <a className="button button--primary" href="#projects">
              Explore projects <span aria-hidden="true">↓</span>
            </a>
            <a
              className="button button--quiet"
              href="https://dogfoodhack.com/spec"
              target="_blank"
              rel="noreferrer"
            >
              Read the challenge spec <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="event-hero__note">
            <span className="event-hero__note-label">EVENT WINDOW</span>
            <time dateTime="2026-09-26">26 Sep</time> — <time dateTime="2026-09-29">29 Sep 2026</time>
            <span className="event-hero__note-separator">·</span> Online <span className="event-hero__note-separator">·</span> Free
          </p>
        </div>

        <aside className="event-board" aria-label="DOGFOOD 2026 event dates and build format">
          <div className="event-board__topline">
            <span>EVENT / 2026</span>
            <span>26—29 SEP</span>
          </div>
          <div className="event-board__center">
            <p className="event-board__month">SEPTEMBER</p>
            <p className="event-board__dates">26<span>—</span>29</p>
            <p className="event-board__location"><span className="status-dot" aria-hidden="true" /> ONLINE / GLOBAL</p>
          </div>
          <div className="event-board__bottom">
            <div>
              <span>01 / FORMAT</span>
              <strong>72-hour build</strong>
            </div>
            <div>
              <span>02 / ENTRY</span>
              <strong>Free to join</strong>
            </div>
          </div>
          <span className="event-board__corner" aria-hidden="true">DF / 26</span>
        </aside>
      </section>

      <section className="event-snapshot" aria-labelledby="snapshot-title">
        <div className="event-snapshot__heading">
          <p className="eyebrow" id="snapshot-title">AT A GLANCE <span>/ 01</span></p>
        </div>
        <div className="event-snapshot__grid">
          {eventFacts.map((fact, index) => (
            <article className="fact-tile" key={fact.label}>
              <span className="fact-tile__index">0{index + 1}</span>
              <p className="fact-tile__value">{fact.value}</p>
              <p className="fact-tile__label">{fact.label}</p>
              <p className="fact-tile__detail">{fact.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
