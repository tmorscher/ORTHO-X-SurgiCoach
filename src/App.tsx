const stackItems = [
  { name: 'SurgiCorder', action: 'Capture' },
  { name: 'SurgiCoach', action: 'Understand' },
  { name: 'SurgiSim', action: 'Train' },
  { name: 'SurgiNaut', action: 'Execute' }
];

const productMoments = [
  {
    name: 'SURGICORDER',
    title: 'Capture surgery as data.',
    body: 'SurgiCorder records surgical experience and makes it computable. From imaging to video to notes—every case becomes structured intelligence.',
    bridge: 'From experience → structure.'
  },
  {
    name: 'SURGICOACH',
    title: 'AI for surgical decisions.',
    body: 'SurgiCoach understands cases, retrieves similar outcomes, and supports decisions in real time.',
    bridge: 'From uncertainty → clarity.'
  },
  {
    name: 'SURGISIM',
    title: 'Turning surgery into training data.',
    body: 'SurgiSim generates synthetic surgical experience to train AI systems at scale.',
    bridge: 'From rare cases → infinite learning.'
  },
  {
    name: 'SURGINAUT',
    title: 'The operating system for surgery.',
    body: 'SurgiNaut brings intelligence into the OR—guiding workflows today, enabling autonomy tomorrow.',
    bridge: 'From insight → action.'
  }
];

function OrbitalVisual() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-white/15 bg-black/70 md:h-[380px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(80,160,255,0.35),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(93,212,180,0.22),transparent_42%)]" />
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      <div className="absolute left-[34%] top-[38%] h-2.5 w-2.5 rounded-full bg-cyan-300/90" />
      <div className="absolute right-[28%] top-[60%] h-2 w-2 rounded-full bg-emerald-300/90" />
      <div className="absolute bottom-[30%] left-[56%] h-1.5 w-1.5 rounded-full bg-blue-200/90" />
    </div>
  );
}

export default function App() {
  return (
    <main className="bg-white text-black">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-20 text-center text-white">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_15%,rgba(66,153,225,0.3),transparent_35%),radial-gradient(circle_at_75%_80%,rgba(45,212,191,0.16),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))]" />
        <div className="relative z-10 max-w-5xl space-y-8">
          <p className="text-xs uppercase tracking-[0.35em] text-white/55">SURGINAUT / SURGICAL INTELLIGENCE SUITE</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-7xl">
            Surgery is becoming intelligence.<br />We’re building the system behind it.
          </h1>
          <p className="text-sm tracking-[0.2em] text-white/70 md:text-base">From experience → data → intelligence → execution</p>
          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <button className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-white/90">Explore the Stack</button>
            <button className="rounded-full border border-white/35 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10">Request Early Access</button>
          </div>
          <p className="pt-14 text-xs uppercase tracking-[0.32em] text-white/45">Surgical Intelligence Suite</p>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
            Surgery doesn’t scale.<br />Expertise is trapped<br />in videos, notes, and experience.<br /><br />AI can’t use it.<br />Robots can’t learn from it.<br /><br />That’s about to change.
          </p>
        </div>
      </section>

      <section className="bg-black px-6 py-24 text-center text-white md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-4xl font-semibold leading-tight tracking-tight md:text-7xl">
            The future of surgery<br />depends on one thing:<br /><span className="text-cyan-200">Structured surgical intelligence</span>
          </p>
        </div>
      </section>

      <section className="px-6 py-24 md:py-28">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-black/45">Introducing the Surgical Intelligence Suite</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {stackItems.map((item) => (
              <article key={item.name} className="rounded-2xl border border-black/15 p-6 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">{item.action}</p>
                <h3 className="pt-3 text-2xl font-semibold tracking-tight">{item.name}</h3>
              </article>
            ))}
          </div>
          <p className="text-center text-sm uppercase tracking-[0.2em] text-black/55">One system. Four layers. Infinite learning.</p>
        </div>
      </section>

      {productMoments.map((item, index) => (
        <section key={item.name} className={index % 2 === 0 ? 'bg-white px-6 py-20 md:py-24' : 'bg-black px-6 py-20 text-white md:py-24'}>
          <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-14">
            <div className="space-y-5">
              <p className={index % 2 === 0 ? 'text-xs uppercase tracking-[0.26em] text-black/45' : 'text-xs uppercase tracking-[0.26em] text-white/50'}>{item.name}</p>
              <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{item.title}</h2>
              <p className={index % 2 === 0 ? 'max-w-xl text-lg text-black/70' : 'max-w-xl text-lg text-white/75'}>{item.body}</p>
              <p className={index % 2 === 0 ? 'text-sm uppercase tracking-[0.22em] text-blue-600' : 'text-sm uppercase tracking-[0.22em] text-cyan-200'}>{item.bridge}</p>
            </div>
            <OrbitalVisual />
          </div>
        </section>
      ))}

      <section className="px-6 py-24 md:py-28">
        <div className="mx-auto max-w-5xl space-y-10 text-center">
          <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">Intelligence compounds.</h2>
          <div className="rounded-full border border-black/15 px-5 py-5 text-sm uppercase tracking-[0.24em] md:text-base">
            Cases → Data → AI → Decisions → Outcomes → Cases
          </div>
          <p className="text-black/60">Every surgery makes the system smarter.</p>
        </div>
      </section>

      <section className="bg-black px-6 py-24 text-white md:py-28">
        <div className="mx-auto max-w-6xl space-y-10">
          <h2 className="text-center text-4xl font-semibold tracking-tight md:text-6xl">Three breakthroughs made this possible</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Multimodal AI', 'Understands images, text, context'],
              ['Physical AI', 'Learns actions, not just predictions'],
              ['Synthetic data', 'Scales experience infinitely']
            ].map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-white/15 p-6">
                <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
                <p className="pt-3 text-white/70">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-24 text-center text-white md:py-28">
        <p className="mx-auto max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          Others build tools.<br />We build surgical intelligence.
        </p>
      </section>

      <section className="px-6 py-24 text-center md:py-28">
        <p className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Every surgery<br />runs on intelligence.<br /><br />Every operating room<br />runs on SurgiNaut.
        </p>
      </section>

      <section className="px-6 pb-10 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-black/45">Built with leading surgeons and institutions</p>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-5">
          {['AO Foundation', 'Global Trauma Lab', 'Clinical Network', 'Robotic OR Group', 'Academic Centers'].map((logo) => (
            <div key={logo} className="rounded-xl border border-black/15 px-4 py-5 text-xs uppercase tracking-[0.15em] text-black/55">
              {logo}
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 text-center md:py-28">
        <div className="mx-auto max-w-3xl space-y-8">
          <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">Be part of the future of surgery.</h2>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-black/90">Request Early Access</button>
            <button className="rounded-full border border-black/20 px-7 py-3 text-sm font-medium text-black transition hover:bg-black/5">Partner With Us</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 px-6 py-10 text-center text-xs uppercase tracking-[0.2em] text-black/55">
        <p>Surgical Intelligence Suite</p>
        <p className="pt-4">SurgiCorder | SurgiCoach | SurgiSim | SurgiNaut</p>
        <p className="pt-4">Contact · Legal</p>
      </footer>
    </main>
  );
}
