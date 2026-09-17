import './ShippingSection.css';

const SHIPPING_ITEMS = [
  {
    title: 'Ecommerce Packaging',
    desc: 'Mailers and cartons for modern online brands',
  },
  {
    title: 'Premium Product Packaging',
    desc: 'Rigid boxes and branded packaging systems',
  },
  {
    title: 'Export Cartons',
    desc: 'Packaging coordinated for international shipping',
  },
  {
    title: 'Packaging For Creative Brands',
    desc: 'For aesthetically sensitive brands',
  },
  {
    title: 'Agency Collaborations',
    desc: 'Production coordination for creative agencies',
  },
  {
    title: 'Printed Packaging',
    desc: 'Cohesive. Memorable. Ownable.',
  },
];

function ShippingSection() {
  return (
    <section className="shipping">
      <h2 className="shipping-title" data-reveal="lines">
        <span className="reveal-mask">
          <span className="shipping-title-line">Some Things</span>
        </span>
        <span className="reveal-mask">
          <span className="shipping-title-line">We&apos;ve Been Shipping.</span>
        </span>
      </h2>

      <div className="shipping-grid">
        {SHIPPING_ITEMS.map((item, index) => (
          <div
            className={`shipping-row${
              index % 2 === 1 ? ' shipping-row--reverse' : ''
            }`}
            key={item.title}
          >
            <div className="shipping-image" aria-hidden="true" data-reveal="image" />
            <div className="shipping-copy" data-reveal="fade">
              <h3 className="shipping-copy-title">{item.title}</h3>
              <p className="shipping-copy-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="shipping-closing" data-reveal="lines">
        <div className="reveal-mask">
          <p className="shipping-closing-line shipping-closing-line--lg">
            Good Packaging <br></br> Doesn&apos;t{' '}
            <span className="shipping-closing-blur">Scream</span>
          </p>
        </div>
        <div className="reveal-mask">
          <p className="shipping-closing-line">It Just Quietly Makes</p>
        </div>
        <div className="reveal-mask">
          <p className="shipping-closing-line">The Brand Feel More Legit.</p>
        </div>
      </div>
    </section>
  );
}

export default ShippingSection;