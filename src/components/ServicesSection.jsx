import packageImg from '../images/package-img.webp';

const SERVICES = [
  { title: 'Packaging Design & Consultation', tags: ['Intentional', 'Scalable', 'Photogenic'] },
  { title: 'Packaging Systems', tags: ['Brand Language', 'SKU Consistency'] },
  { title: 'Corrugated Boxes', tags: ['Ecommerce', 'Retail', 'Exports'] },
  { title: 'Ecommerce Mailers', tags: ['D2C', 'Unboxing-ready'] },
  { title: 'Premium & Rigid Boxes', tags: ['Gifting', 'Premium', 'Launches'] },
  { title: 'Vendor Coordination & Production', tags: ['Sourcing', 'QC', 'Dispatch'] },
];

function ServicesSection() {
  return (
    <div className="bg-[#efebe0]" style={{ padding: '50px 0px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#282723]" style={{ margin: '0px 20px 0px' }}>
        {SERVICES.map((service) => (
          <div className="border-r border-b border-[#282723] flex flex-col" style={{ padding: '24px' }} key={service.title}>
            <img
              src={packageImg}
              alt={service.title}
              className="w-full h-[180px] sm:h-[200px] object-cover rounded-[14px] bg-[#b7c740]" style={{ marginBottom: '16px' }}
            />  
            <h3 className="font-['Easy_Pixel_Regular',Arial,sans-serif] text-[clamp(20px,3vw,29px)] font-medium leading-[1.3] text-[#282723]" style={{ marginBottom: "20px"}}>{service.title}</h3>
            <div className="flex flex-wrap gap-[6px]" style={{ marginTop: 'auto' }}>
              {service.tags.map((tag) => (
                <span className="font-['Sharp_Grotesk_PE_Trial_Book',Arial,sans-serif] text-[12px] font-medium text-[#c5d12d] bg-[#2a3482] rounded" style={{ padding: '4px 10px' }} key={tag}>
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
>
  Good packaging protects products.
  <br />
  Great packaging protects perception.
</p>
    </div>
  );
}

export default ServicesSection;