export default function FinalCTA() {
  return (
    <section
      className="py-28 text-center"
      style={{ background: "#17181B", borderTop: "1px solid #2A2C30" }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <h2
          className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1] mb-5"
          style={{ color: "#F2F2F0" }}
        >
          Ready to build your shadows?
        </h2>
        <p
          className="text-lg max-w-xl mx-auto mb-8"
          style={{ color: "#8B8D93" }}
        >
          No signup, no trial, no paywall. Open the tool and start designing.
        </p>
        <a
          href="/editor"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-150 active:scale-[0.97]"
          style={{ background: "#E8664D", color: "#0E0F11" }}
        >
          Open Layerbox
        </a>
      </div>
    </section>
  );
}
