import './Sections.css';

const WORK_ITEMS = [
  'Interactive 3D product configurator for a Nordic furniture brand.',
  'WebGL scroll-driven story for a sustainability campaign.',
  'AI-assisted onboarding flow for a fintech app.',
];

function SelectedWorkSection() {
  return (
    <div className="section s2">
      <h1 style={{ fontSize: '48px' }}>Selected Work</h1>
      <div className="grid">
        {WORK_ITEMS.map((item) => (
          <div className="card" key={item}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectedWorkSection;
