import Link from "next/link";

export default function Home() {
  return (
    <div className="relative isolate flex min-h-[calc(100vh-121px)] items-center overflow-hidden bg-[#230533] px-6 py-14 sm:px-10 lg:px-16">
      <div className="brand-orb absolute -left-52 top-1/2 h-[38rem] w-[38rem] -translate-y-1/2 rounded-full" />
      <div
        className="absolute inset-0 opacity-35"
        style={{ backgroundImage: "url('/axon-brand/axon-gradient-1.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[#64dfec]">AI infrastructure readiness</p>
          <h1 className="mb-6 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl" style={{ lineHeight: 1.04 }}>
            Find your strongest path to practical AI.
          </h1>
          <p className="mb-8 max-w-xl text-base font-light leading-7 text-white/80 sm:text-lg">
            In ten minutes, see how ready your organisation is to implement AI and automation — and where to focus first.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/quiz" className="gradient-bg inline-flex h-12 items-center justify-center rounded-lg px-7 text-sm font-semibold text-white no-underline">
              Start the free assessment <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <span className="text-sm font-medium text-[#64dfec]">30 questions · Personalised results</span>
          </div>
          <Link href="/dashboard" className="mt-10 inline-flex text-sm text-white/55 underline decoration-white/25 underline-offset-4 hover:text-white">
            Staff area →
          </Link>
        </div>
        <div className="hero-panel relative mx-auto w-full max-w-md overflow-hidden rounded-3xl p-5 sm:p-8">
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#64dfec]/15 blur-3xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/axon-brand/readiness-visual.png" alt="Abstract Axon illustration representing connected digital systems" className="hero-art relative mx-auto w-full max-w-sm" />
          <div className="relative mt-1 rounded-2xl border border-white/15 bg-[#230533]/70 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#64dfec]">Your assessment covers</p>
            <p className="mt-3 text-sm leading-6 text-white/85">People, process, data, tools and ambition — the foundations for an AI programme that delivers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
