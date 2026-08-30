import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const DEFAULT_SETTINGS = {
  starCount: 220,
  starSize: 1.8,
  starSpeed: 1,
  shootingStarCount: 3,
  shootingStarSpeed: 1,
};

const ranges = [
  { key: "starCount", label: "Star count", min: 50, max: 500, step: 10 },
  { key: "starSize", label: "Star size", min: 0.8, max: 3.5, step: 0.1 },
  { key: "starSpeed", label: "Star speed", min: 0.4, max: 2.5, step: 0.1 },
  { key: "shootingStarCount", label: "Shooting stars", min: 0, max: 8, step: 1 },
  { key: "shootingStarSpeed", label: "Shooting speed", min: 0.4, max: 2.5, step: 0.1 },
];

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => ((value = (value * 16807) % 2147483647) - 1) / 2147483646;
}

function formatValue(key, value) {
  if (key === "starCount" || key === "shootingStarCount") return value;
  return `${Number(value).toFixed(1)}${key === "starSize" ? " px" : "×"}`;
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5a2 2 0 0 1 1.9 1.37l.2.61a2 2 0 0 0 2.67 1.2l.58-.26a2 2 0 0 1 2.52.76l.13.22a2 2 0 0 1-.62 2.56l-.51.36a2 2 0 0 0 0 3.27l.51.36a2 2 0 0 1 .62 2.56l-.13.22a2 2 0 0 1-2.52.76l-.58-.26a2 2 0 0 0-2.67 1.2l-.2.61a2 2 0 0 1-1.9 1.37h-.26a2 2 0 0 1-1.9-1.37l-.2-.61a2 2 0 0 0-2.67-1.2l-.58.26a2 2 0 0 1-2.52-.76l-.13-.22a2 2 0 0 1 .62-2.56l.51-.36a2 2 0 0 0 0-3.27l-.51-.36a2 2 0 0 1-.62-2.56l.13-.22a2 2 0 0 1 2.52-.76l.58.26a2 2 0 0 0 2.67-1.2l.2-.61a2 2 0 0 1 1.9-1.37H12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

function FullscreenIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {active ? (
        <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
      ) : (
        <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
      )}
    </svg>
  );
}

function Stars() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [seed, setSeed] = useState(() => Date.now());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const stars = useMemo(() => {
    const random = seededRandom(seed);
    return Array.from({ length: settings.starCount }, (_, index) => ({
      id: `${seed}-star-${index}`,
      x: random() * 100,
      y: random() * 100,
      size: (0.45 + random() * 0.9) * settings.starSize,
      opacity: 0.25 + random() * 0.75,
      delay: random() * -8,
      duration: (3.2 * (0.65 + random() * 0.9)) / settings.starSpeed,
      color: random() > 0.88 ? "warm" : random() > 0.84 ? "cool" : "white",
    }));
  }, [seed, settings.starCount, settings.starSize, settings.starSpeed]);

  const shootingStars = useMemo(() => {
    const random = seededRandom(seed + 9199);
    return Array.from({ length: settings.shootingStarCount }, (_, index) => {
      const angle = 24 + random() * 18;
      const travel = 38 + random() * 28;
      const duration = (9 + random() * 7) / settings.shootingStarSpeed;

      return {
        id: `${seed}-shooting-${index}`,
        x: -12 + random() * 78,
        y: -8 + random() * 42,
        angle,
        travelX: travel,
        travelY: travel * Math.tan((angle * Math.PI) / 180),
        delay: -random() * duration,
        duration,
        length: 55 + random() * 75,
      };
    });
  }, [seed, settings.shootingStarCount, settings.shootingStarSpeed]);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: Number(value) }));
  };

  const generateSky = () => setSeed(Date.now() + Math.floor(Math.random() * 10000));

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  };

  return (
    <main className="night-sky" aria-label="A randomly generated night sky">
      <div className="nebula nebula-one" />
      <div className="nebula nebula-two" />
      <div className="stars" aria-hidden="true">
        {stars.map((star) => (
          <span
            className={`star star-${star.color}`}
            key={star.id}
            style={{
              "--x": `${star.x}%`,
              "--y": `${star.y}%`,
              "--size": `${star.size}px`,
              "--opacity": star.opacity,
              "--delay": `${star.delay}s`,
              "--duration": `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="shooting-stars" aria-hidden="true">
        {shootingStars.map((star) => (
          <span
            className="shooting-star"
            key={star.id}
            style={{
              "--x": `${star.x}%`,
              "--y": `${star.y}%`,
              "--angle": `${star.angle}deg`,
              "--travel-x": `${star.travelX}vw`,
              "--travel-y": `${star.travelY}vw`,
              "--delay": `${star.delay}s`,
              "--duration": `${star.duration}s`,
              "--length": `${star.length}px`,
            }}
          />
        ))}
      </div>

      <section className={`controls ${settingsOpen ? "controls-open" : ""}`} aria-label="Sky controls">
        <div className="settings-panel" id="sky-settings" aria-hidden={!settingsOpen}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Observatory</span>
              <h1>Tune the night</h1>
            </div>
          </div>

          <div className="settings-list">
            {ranges.map((range) => (
              <label className="setting" key={range.key}>
                <span>{range.label}</span>
                <output>{formatValue(range.key, settings[range.key])}</output>
                <input
                  type="range"
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={settings[range.key]}
                  tabIndex={settingsOpen ? 0 : -1}
                  onChange={(event) => updateSetting(range.key, event.target.value)}
                />
              </label>
            ))}
          </div>

          <button className="generate-button" type="button" tabIndex={settingsOpen ? 0 : -1} onClick={generateSky}>
            <span>Generate new sky</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="control-buttons">
          <button
            className="icon-button"
            type="button"
            aria-label={settingsOpen ? "Hide sky settings" : "Show sky settings"}
            aria-controls="sky-settings"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((open) => !open)}
          >
            <SettingsIcon />
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={toggleFullscreen}
          >
            <FullscreenIcon active={isFullscreen} />
          </button>
        </div>
      </section>
    </main>
  );
}

export default Stars;
