import { Plus, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useForm } from '../hooks/useForm';
import { requestApi } from '../services/marketplaceApi';

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { values, handleChange, reset } = useForm({ title: '', description: '', budget: '' });
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  function addSkill() {
    const nextSkill = skillInput.trim();
    if (!nextSkill || skills.includes(nextSkill)) return;
    setSkills((items) => [...items, nextSkill]);
    setSkillInput('');
  }

  function removeSkill(skill) {
    setSkills((items) => items.filter((item) => item !== skill));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await requestApi.create({ ...values, skills });
      pushToast('Request created successfully.');
      reset();
      setSkills([]);
      navigate('/user-dashboard');
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to create request.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Create Request" subtitle="Turn an AI idea into a clear marketplace opportunity.">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="hover:shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Title" name="title" value={values.title} onChange={handleChange} placeholder="AI customer support chatbot" />
            <Textarea label="Description" name="description" value={values.description} onChange={handleChange} placeholder="Describe the expected workflow, integrations, timeline, and deliverables." />
            <Input label="Budget" name="budget" value={values.budget} onChange={handleChange} placeholder="$2,500" />
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Skills Required</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white/85 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Add skill"
                />
                <Button onClick={addSkill} variant="secondary" className="sm:w-auto"><Plus className="h-4 w-4" /> Add</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
              {loading ? 'Submitting...' : 'Submit Request'} <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <Card className="h-fit hover:shadow-soft">
          <p className="font-display text-xl font-bold text-slate-950">Request preview</p>
          <div className="mt-5 rounded-lg bg-gradient-to-br from-primary to-accent p-5 text-white">
            <p className="text-sm font-semibold text-blue-100">{values.budget ? `$${values.budget}` : '$2,500'}</p>
            <h2 className="mt-3 font-display text-2xl font-bold">{values.title || 'AI service request'}</h2>
            <p className="mt-4 text-sm leading-6 text-blue-50">{values.description || 'Your polished request summary will appear here as you type.'}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">{skill}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
