import './Sections.css';

function ScrollInfoSection() {
  return (
    <div className="section s3">
      <h1 style={{ fontSize: '48px' }}>Keep Scrolling</h1>
      <p className="lead">
        Notice the edges curve more than the center as you move through the
        page — that&apos;s the same radial displacement math from the
        barrel-distortion shader, just applied through CSS/SVG instead of
        WebGL, so real content can scroll through it.
      </p>
    </div>
  );
}

export default ScrollInfoSection;
