import './Marquee.css';

const ITEMS = [
  'Corrugated Boxes',
  'Mailers',
  'Printed Packaging',
  'Export Cartons',
  'Packaging Systems',
   'Corrugated Boxes',
  'Mailers',
  'Printed Packaging',
  'Export Cartons',
  'Packaging Systems',
];

function MarqueeTrack() {
  return (
    <>
      {ITEMS.map((item) => (
        <span className="marquee-item" key={item}>
          {item}
          <span className="marquee-divider"> | </span>
        </span>
      ))}
    </>
  );
}

function Marquee() {
  return (
    <div className="marquee" data-reveal="fade">
      <div className="marquee-track">
        {/* rendered twice back-to-back so the loop is seamless */}
        <MarqueeTrack />
        <MarqueeTrack />
      </div>
    </div>
  );
}

export default Marquee;