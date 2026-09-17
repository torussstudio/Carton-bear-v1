import packagingDesign from '../images/packaging-design.png';
import packagingSystems from '../images/packaging-systems.png';
import corrugatedBoxes from '../images/Corrugated-boxes.png';
import ecommerceMailers from '../images/ecommerce-mailers.png';
import premiumBoxes from '../images/premium-boxes.png';
import vendorCoordination from '../images/vendor-coordination.png';

const SERVICES = [
  { title: 'Packaging Design & Consultation', tags: ['Intentional', 'Scalable', 'Photogenic'], image: packagingDesign },
  { title: 'Packaging Systems', tags: ['Brand Language', 'SKU Consistency'], image: packagingSystems },
  { title: 'Corrugated Boxes', tags: ['Ecommerce', 'Retail', 'Exports'], image: corrugatedBoxes },
  { title: 'Ecommerce Mailers', tags: ['D2C', 'Unboxing-ready'], image: ecommerceMailers },
  { title: 'Premium & Rigid Boxes', tags: ['Gifting', 'Premium', 'Launches'], image: premiumBoxes },
  { title: 'Vendor Coordination & Production', tags: ['Sourcing', 'QC', 'Dispatch'], image: vendorCoordination },
];

function ServicesSection() {
  return (
    <div className="bg-[#ffecbd]" style={{ padding: '50px 0px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#282723]" style={{ margin: '0px 20px 0px' }}>
        {SERVICES.map((service) => (
          <div className="border-r border-b border-[#282723] flex flex-col" style={{ padding: '24px' }} key={service.title} data-reveal="fade">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-[180px] sm:h-[200px] object-cover rounded-[14px] bg-[#b7c740]" style={{ marginBottom: '16px' }}
              data-reveal="image"
            />  
            <h3 className="font-['Easy_Pixel_Regular',Arial,sans-serif] text-[clamp(20px,3vw,29px)] font-medium leading-[1.3] text-[#282723]" style={{ marginBottom: "15px"}}>{service.title}</h3>
            <div className="flex flex-wrap gap-[6px]" style={{ marginTop: 'auto' }}>
              {service.tags.map((tag) => (
                <span className="font-['Sharp_Grotesk_PE_Trial_Book',Arial,sans-serif] text-[14px] font-medium text-[#c5d12d] bg-[#2a3482]" style={{ padding: '4px 10px' }} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p
        className="flex justify-center text-center text-[clamp(24px,4vw,60px)] leading-[1.2] text-[#1a1a1a]"
        style={{
          fontFamily: "'Myriad Pro', Arial, sans-serif",
          padding: '50px 20px',
          marginTop: '50px',
        }}
        data-reveal="fade"
      >
        Good packaging protects products.
        <br />
        Great packaging protects perception.
      </p>
    </div>
  );
}

export default ServicesSection;