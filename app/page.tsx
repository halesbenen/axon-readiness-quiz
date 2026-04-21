import Link from "next/link";

export default function Home() {
  return (
    <div className="lsplash">
      <div className="lband" />
      <div className="lpill lp1" /><div className="lpill lp2" /><div className="lpill lp3" />
      <div className="lpill lp4" /><div className="lpill lp5" /><div className="lpill lp6" />
      <div className="lpill lp7" /><div className="lpill lp8" /><div className="lpill lp9" />
      <div className="lghost">READY</div>

      <div className="lcontent flex flex-col items-center text-center max-w-xl px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/axon-logo-whiteout.svg"
          alt="Axon IT"
          style={{ width: 120, height: "auto", marginBottom: 24 }}
        />

        <div className="gradient-bar" style={{ width: 80, marginBottom: 32 }} />

        <h1
          className="text-3xl"
          style={{ fontWeight: 600, color: "#ffffff", marginBottom: 16, lineHeight: 1.25 }}
        >
          Is Your Business Ready for AI?
        </h1>

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

        <Link
          href="/quiz"
          className="gradient-bg inline-flex items-center justify-center text-white"
          style={{
            height: 48,
            width: 220,
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Start the assessment →
        </Link>

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

      <style>{`
        .lsplash {
          position: relative;
          min-height: 100vh;
          background: #230533;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 64px 0;
        }
        .lband {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 52%;
          background: linear-gradient(145deg, #ff1d79 0%, #a900f1 50%, #3900ce 100%);
          z-index: 0;
        }
        .lband::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 80px;
          background: #230533;
          clip-path: polygon(0 100%, 100% 0, 100% 100%);
        }
        .lpill { position: absolute; border-radius: 100px; }
        .lp1 { width: 400px; height: 120px; background: rgba(255,255,255,0.07);  top: -32px;   right: -80px;  transform: rotate(-18deg); z-index: 1; }
        .lp2 { width: 220px; height: 66px;  background: rgba(100,223,236,0.14); top: 60px;    right: 60px;   transform: rotate(12deg);  z-index: 1; }
        .lp3 { width: 160px; height: 48px;  background: rgba(255,255,255,0.06); top: 140px;   right: 220px;  transform: rotate(-6deg);  z-index: 1; }
        .lp4 { width: 90px;  height: 28px;  background: rgba(255,29,121,0.22);  top: 48px;    left: 180px;   transform: rotate(24deg);  z-index: 1; }
        .lp5 { width: 300px; height: 90px;  background: rgba(57,0,206,0.20);    bottom: 180px; left: -50px;  transform: rotate(-10deg); z-index: 1; }
        .lp6 { width: 130px; height: 40px;  background: rgba(100,223,236,0.10); bottom: 240px; left: 200px;  transform: rotate(8deg);   z-index: 1; }
        .lp7 { width: 60px;  height: 18px;  background: rgba(255,255,255,0.08); bottom: 320px; right: 80px;  transform: rotate(-28deg); z-index: 1; }
        .lp8 { width: 200px; height: 60px;  background: rgba(169,0,241,0.16);   bottom: 120px; right: -30px; transform: rotate(15deg);  z-index: 1; }
        .lp9 { width: 70px;  height: 22px;  background: rgba(255,29,121,0.18);  top: 200px;    left: 44px;   transform: rotate(-14deg); z-index: 1; }
        .lghost {
          position: absolute;
          bottom: 40px; right: -20px;
          font-size: clamp(80px, 18vw, 160px);
          font-weight: 600;
          color: rgba(169,0,241,0.06);
          letter-spacing: -0.05em;
          line-height: 1;
          white-space: nowrap;
          z-index: 0;
          user-select: none;
          pointer-events: none;
        }
        .lcontent { position: relative; z-index: 2; }
      `}</style>
    </div>
  );
}
