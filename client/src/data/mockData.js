export const user = {
  name: 'Aarav Mehta',
  email: 'aarav@neuralforge.ai',
  role: 'provider',
  company: 'NeuralForge Studio',
  location: 'Bengaluru, India',
  avatar: 'AM',
  bio: 'AI automation specialist helping teams ship smarter internal workflows, research assistants, and customer support agents.',
};

export const stats = [
  { label: 'Total Requests', value: '128', trend: '+18%', tone: 'from-indigo-500 to-blue-500' },
  { label: 'Applications Sent', value: '47', trend: '+9%', tone: 'from-violet-500 to-fuchsia-500' },
  { label: 'Active Requests', value: '16', trend: '+5%', tone: 'from-cyan-500 to-indigo-500' },
];

export const requests = [
  {
    id: 1,
    title: 'AI customer support chatbot',
    description: 'Build a trained assistant that answers product questions, escalates tickets, and integrates with Intercom.',
    budget: '$2,800',
    tags: ['OpenAI', 'LangChain', 'Support'],
    owner: 'Flowdesk',
    posted: '2h ago',
  },
  {
    id: 2,
    title: 'Sales lead scoring workflow',
    description: 'Create an automation that enriches leads, scores purchase intent, and sends summaries to HubSpot.',
    budget: '$1,650',
    tags: ['Automation', 'CRM', 'Python'],
    owner: 'ScalePilot',
    posted: '5h ago',
  },
  {
    id: 3,
    title: 'Document intelligence pipeline',
    description: 'Extract clauses, deadlines, and risk signals from contracts with a review dashboard for legal teams.',
    budget: '$4,200',
    tags: ['RAG', 'OCR', 'Legal AI'],
    owner: 'Lexora',
    posted: '1d ago',
  },
  {
    id: 4,
    title: 'Marketing content generator',
    description: 'Design prompt flows for campaign briefs, landing page copy, social variations, and brand checks.',
    budget: '$1,200',
    tags: ['Content', 'Prompting', 'SaaS'],
    owner: 'LaunchLayer',
    posted: '2d ago',
  },
  {
    id: 5,
    title: 'Internal analytics copilot',
    description: 'Connect BI data and let managers ask revenue, churn, and product usage questions in plain English.',
    budget: '$5,000',
    tags: ['Analytics', 'SQL', 'Copilot'],
    owner: 'OrbitIQ',
    posted: '3d ago',
  },
  {
    id: 6,
    title: 'AI onboarding assistant',
    description: 'Create a guided employee onboarding assistant with policy search and personalized task checklists.',
    budget: '$2,350',
    tags: ['HR Tech', 'Search', 'UX'],
    owner: 'PeopleNest',
    posted: '4d ago',
  },
];

export const applications = [
  { id: 1, request: 'AI customer support chatbot', client: 'Flowdesk', date: 'Apr 28, 2026', amount: '$2,800', status: 'Pending' },
  { id: 2, request: 'Sales lead scoring workflow', client: 'ScalePilot', date: 'Apr 25, 2026', amount: '$1,650', status: 'Accepted' },
  { id: 3, request: 'Marketing content generator', client: 'LaunchLayer', date: 'Apr 21, 2026', amount: '$1,200', status: 'Rejected' },
  { id: 4, request: 'Internal analytics copilot', client: 'OrbitIQ', date: 'Apr 18, 2026', amount: '$5,000', status: 'Pending' },
];

export const activities = [
  { title: 'Proposal sent to Flowdesk', meta: 'AI customer support chatbot', time: '18 minutes ago' },
  { title: 'ScalePilot accepted your application', meta: 'Sales lead scoring workflow', time: 'Yesterday' },
  { title: 'New request matched your skills', meta: 'Document intelligence pipeline', time: '2 days ago' },
  { title: 'Profile viewed by OrbitIQ', meta: 'Internal analytics copilot', time: '3 days ago' },
];

export const testimonials = [
  {
    quote: 'We found a specialist for our RAG workflow in a single afternoon. The quality of proposals felt unusually high.',
    name: 'Maya Shah',
    title: 'COO, Lexora',
  },
  {
    quote: 'The marketplace makes AI services feel less risky because every request, skill, and budget is structured clearly.',
    name: 'Daniel Kim',
    title: 'Founder, LaunchLayer',
  },
  {
    quote: 'It helped our team compare providers quickly and launch an internal assistant without weeks of vendor calls.',
    name: 'Priya Raman',
    title: 'Product Lead, OrbitIQ',
  },
];
