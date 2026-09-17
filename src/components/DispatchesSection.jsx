import './DispatchesSection.css';

const DISPATCH_ITEMS = [
  'Why Most Packaging Delays Have Nothing to Do With Manufacturing',
  'Cheap Packaging Gets Expensive Very Fast',
  'The Difference Between Packaging That Looks Good and Packaging That Actually Works',
  'Packaging Is Branding. Logistics. Operations. Psychology.',
  'What D2C Founders Should Know Before Printing Their First 10,000 Boxes',
  'Export Packaging Mistakes That Cost Brands Time & Money',
];

function DispatchesSection() {
  return (
    <section className="dispatches">
      <h2 className="dispatches-title" data-reveal="lines">
        <span className="reveal-mask">
          <span className="dispatches-title-line">Dispatches From</span>
        </span>
        <span className="reveal-mask">
          <span className="dispatches-title-line">Cartonbear.</span>
        </span>
      </h2>

      <ul className="dispatches-list">
        {DISPATCH_ITEMS.map((item, index) => (
          <li className="dispatches-list-item" key={item} data-reveal="fade">
            <span className="dispatches-list-text">{item}</span>
            <span className="dispatches-list-number">
              {String(index + 1).padStart(3, '0')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default DispatchesSection;