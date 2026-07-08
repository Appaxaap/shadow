export default function Footer() {
  return (
    <footer
      className="py-10"
      style={{
        background: "#0E0F11",
        borderTop: "1px solid #2A2C30",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Appaxaap/Layerbox"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: "#8B8D93" }}
          >
            GitHub
          </a>
          <a
            href="/editor"
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: "#8B8D93" }}
          >
            Editor
          </a>
        </div>
        <p
          className="text-xs"
          style={{ color: "#5A5C62" }}
        >
          Layerbox &middot; MIT License
        </p>
      </div>
    </footer>
  );
}
