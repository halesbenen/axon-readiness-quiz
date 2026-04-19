import Link from "next/link";

export default function Home() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: "#230533" }}
    >
      <div className="flex flex-col items-center text-center max-w-xl">
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/axon-logo-whiteout.svg"
          alt="Axon IT"
          style={{ width: 120, height: "auto", marginBottom: 24 }}
        />

        {/* Gradient bar accent */}
        <div className="gradient-bar" style={{ width: 80, marginBottom: 32 }} />

        {/* Headline */}
        <h1
          className="text-3xl"
          style={{ fontWeight: 600, color: "#ffffff", marginBottom: 16, lineHeight: 1.25 }}
        >
          Is Your Business Ready for AI?
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: 16,
            fontWeight: 300,
            color: "#64dfec",
            marginBottom: 40,
            lineHeight: 1.65,
          }}
        >
          Answer 30 questions and get a personalised breakdown of your AI &amp; Automation
          readiness, free, in 10 minutes.
        </p>

        {/* CTA button */}
        <Link
          href="/quiz"
          className="gradient-bg inline-flex items-center justify-center text-white"
          style={{
            height: 48,
            width: 200,
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Start the assessment →
        </Link>

        {/* Dimensions note */}
        <p
          style={{
            fontSize: 12,
            color: "#a900f1",
            marginTop: 20,
            fontWeight: 400,
          }}
        >
          Covers: People · Process · Data · Tools · Ambition
        </p>
      </div>
    </div>
  );
}
