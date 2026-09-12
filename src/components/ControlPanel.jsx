import './ControlPanel.css';

function ControlPanel({
  bulge,
  onBulgeChange,
  scan,
  onScanChange,
  grain,
  onGrainChange,
}) {
  return (
    <div id="panel">
      <div className="control">
        Bulge <span className="val">{bulge}</span>
        <input
          type="range"
          min="0"
          max="150"
          value={bulge}
          onChange={(e) => onBulgeChange(Number(e.target.value))}
        />
      </div>

      <div className="control">
        Vignette handled visually — Scanlines <span className="val">{scan}</span>
        <input
          type="range"
          min="0"
          max="0.8"
          step="0.01"
          value={scan}
          onChange={(e) => onScanChange(Number(e.target.value))}
        />
      </div>

      <div className="control">
        Grain <span className="val">{grain}</span>
        <input
          type="range"
          min="0"
          max="0.25"
          step="0.005"
          value={grain}
          onChange={(e) => onGrainChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default ControlPanel;
