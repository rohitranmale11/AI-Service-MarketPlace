import { ArrowRight, BrainCircuit, CheckCircle2, Layers3, ShieldCheck, Sparkles, WandSparkles, Workflow, Zap } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import MarketingLayout from '../layouts/MarketingLayout';
import { testimonials } from '../data/mockData';

const features = [
  { icon: BrainCircuit, title: 'Vetted AI specialists', body: 'Discover providers for automation, agents, copilots, RAG systems, and AI product builds.' },
  { icon: Workflow, title: 'Structured requests', body: 'Turn fuzzy AI ideas into clear scopes with budget, skills, milestones, and proposal signals.' },
  { icon: ShieldCheck, title: 'Confidence by design', body: 'Compare skills, response quality, status, and fit before moving into delivery.' },
  { icon: Layers3, title: 'Backend-ready flows', body: 'Pages, state, data shapes, and service setup are prepared for real integrations.' },
];

const steps = [
  'Post a clear AI service request',
  'Review matched providers and proposals',
  'Track applications from one dashboard',
];

export default function LandingPage() {
  return (
    <MarketingLayout>
      <section className="page-shell grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-soft">
            <Sparkles className="h-4 w-4" />
            Premium marketplace for practical AI work
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Hire elite AI builders for the work that moves your startup forward.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A polished marketplace experience for posting AI projects, comparing providers, and managing applications with clarity.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/requests">Explore Requests <ArrowRight className="h-4 w-4" /></Button>
            <Button to="/signup" variant="secondary">Join Marketplace</Button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
            {['500+ providers', '92% match rate', '24h avg reply'].map((item) => (
              <div key={item} className="rounded-lg border border-white/80 bg-white/70 p-4 text-center shadow-soft backdrop-blur-xl">
                <p className="text-sm font-bold text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="glass rounded-lg p-5">
            <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-6 text-white shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-100">Featured request</p>
                  <h2 className="mt-2 font-display text-2xl font-bold">AI revenue intelligence copilot</h2>
                </div>
                <WandSparkles className="h-9 w-9 text-blue-100" />
              </div>
              <p className="mt-5 text-sm leading-6 text-blue-50">Connect CRM, billing, and product data so operators can ask complex growth questions without waiting on analysts.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['RAG', 'SQL', 'Dashboards', '$5,000'].map((tag) => (
                  <span key={tag} className="rounded-full bg-white/16 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">{tag}</span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {['Proposal quality', 'Provider fit'].map((title, index) => (
                <div key={title} className="rounded-lg bg-white p-5 shadow-soft">
                  <p className="text-sm font-semibold text-slate-500">{title}</p>
                  <p className="mt-3 text-3xl font-extrabold text-slate-950">{index === 0 ? '98%' : '4.9'}</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-500" style={{ width: index === 0 ? '92%' : '86%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-blue-600">Why teams choose it</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-slate-950">Built for serious AI service discovery.</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{feature.body}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="page-shell py-12">
        <div className="glass rounded-lg p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="font-semibold text-blue-600">How it works</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-slate-950">From idea to matched specialist in three clean moves.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step} className="rounded-lg bg-white p-5 shadow-soft">
                  <div className="mb-5 grid h-10 w-10 place-items-center rounded-lg bg-primary font-bold text-white">{index + 1}</div>
                  <p className="font-semibold text-slate-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-12">
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name}>
              <p className="text-sm leading-6 text-slate-600">"{item.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 font-bold text-white">{item.name.slice(0, 2)}</div>
                <div>
                  <p className="font-bold text-slate-950">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="page-shell py-12">
        <div className="rounded-lg bg-gradient-to-r from-secondary to-blue-900 p-8 text-white shadow-soft md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold">Ready to make AI work feel organized?</h2>
              <p className="mt-3 max-w-2xl text-blue-100">Start with a request, browse the marketplace, or jump into the provider dashboard.</p>
            </div>
            <Button to="/dashboard" variant="secondary" className="bg-white text-blue-700">Open Dashboard <Zap className="h-4 w-4" /></Button>
          </div>
        </div>
      </section>

      <footer className="page-shell flex flex-col gap-4 border-t border-slate-200 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>AI Service Marketplace</p>
        <div className="flex gap-5">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </footer>
    </MarketingLayout>
  );
}
