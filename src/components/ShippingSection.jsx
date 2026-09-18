import './ShippingSection.css';

import ecommerceImage from '../images/e-commerce.webp';
import premiumProductImage from '../images/premium-product-packaging.webp';
import exportCartonImage from '../images/export-carton-packaging.webp';
import creativeBrandsImage from '../images/packaging-for-creative-brand.webp';
import agencyCollaborationsImage from '../images/agency-collaboration.webp';
import printedPackagingImage from '../images/printed-packaging.webp';

const SHIPPING_ITEMS = [
  {
    title: 'Ecommerce Packaging',
    desc: 'Mailers and cartons for modern online brands',
    image: ecommerceImage,
  },
  {
    title: 'Premium Product Packaging',
    desc: 'Rigid boxes and branded packaging systems',
    image: premiumProductImage,
  },
  {
    title: 'Export Cartons',
    desc: 'Packaging coordinated for international shipping',
    image: exportCartonImage,
  },
  {
    title: 'Packaging For Creative Brands',
    desc: 'For aesthetically sensitive brands',
    image: creativeBrandsImage,
  },
  {
    title: 'Agency Collaborations',
    desc: 'Production coordination for creative agencies',
    image: agencyCollaborationsImage,
  },
  {
    title: 'Printed Packaging',
    desc: 'Cohesive. Memorable. Ownable.',
    image: printedPackagingImage,
  },
];

function ShippingSection() {
  return (
    <section className="shipping">

      {/* =========================================
          TITLE
      ========================================== */}

      <h2
        className="shipping-title"
        data-reveal="lines"
      >
        <span className="reveal-mask">
          <span className="shipping-title-line">
            Some Things
          </span>
        </span>

        <span className="reveal-mask">
          <span className="shipping-title-line">
            We&apos;ve Been Shipping.
          </span>
        </span>
      </h2>


      {/* =========================================
          SHIPPING ITEMS
      ========================================== */}

      <div className="shipping-grid">

        {SHIPPING_ITEMS.map((item, index) => (
          <div
            className={`shipping-row${
              index % 2 === 1
                ? ' shipping-row--reverse'
                : ''
            }`}
            key={item.title}
          >

            {/* IMAGE */}

            <div
              className="shipping-image"
              data-reveal="image"
            >
              <img
                src={item.image}
                alt=""
                className="shipping-image-content"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>


            {/* TEXT */}

            <div
              className="shipping-copy"
              data-reveal="fade"
            >
              <h3 className="shipping-copy-title">
                {item.title}
              </h3>

              <p className="shipping-copy-desc">
                {item.desc}
              </p>
            </div>

          </div>
        ))}

      </div>


      {/* =========================================
          CLOSING STATEMENT
      ========================================== */}

      <div
        className="shipping-closing"
        data-reveal="lines"
      >

        <div className="reveal-mask">
          <p className="shipping-closing-line shipping-closing-line--lg">
            Good Packaging <br />
            Doesn&apos;t{' '}
            <span className="shipping-closing-blur">
              Scream
            </span>
          </p>
        </div>


        <div className="reveal-mask">
          <p className="shipping-closing-line">
            It Just Quietly Makes
          </p>
        </div>


        <div className="reveal-mask">
          <p className="shipping-closing-line">
            The Brand Feel More Legit.
          </p>
        </div>

      </div>

    </section>
  );
}

export default ShippingSection;