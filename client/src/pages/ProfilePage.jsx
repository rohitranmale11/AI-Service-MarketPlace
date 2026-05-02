import { BadgeCheck, ImagePlus, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';
import Textarea from '../components/Textarea';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileApi } from '../services/profileApi';

const getAvatar = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'AM';

export default function ProfilePage() {
  const { updateProfile } = useAuth();
  const { pushToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProfile() {
    setLoading(true);

    try {
      const { data } = await profileApi.getMe();
      setProfile(data.user);
      updateProfile(data.user);
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function updateField(name, value) {
    setProfile((current) => ({ ...current, [name]: value }));
  }

  function addSkill() {
    const nextSkill = skillInput.trim();
    if (!nextSkill || profile.skills?.includes(nextSkill)) return;
    updateField('skills', [...(profile.skills || []), nextSkill]);
    setSkillInput('');
  }

  function removeSkill(skill) {
    updateField('skills', (profile.skills || []).filter((item) => item !== skill));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateField('profileImage', reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const { data } = await profileApi.update({
        name: profile.name,
        profileImage: profile.profileImage,
        bio: profile.bio,
        skills: profile.skills || [],
      });
      setProfile(data.user);
      updateProfile(data.user);
      pushToast('Profile updated successfully.');
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <DashboardLayout title="Profile" subtitle="Manage your marketplace identity."><Card><Loader label="Loading profile" /></Card></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Profile" subtitle="Manage your marketplace identity, skills, and reputation.">
      <div className="mx-auto grid max-w-5xl gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="h-fit text-center hover:shadow-soft">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt={profile.name} className="mx-auto h-32 w-32 rounded-full object-cover shadow-soft ring-4 ring-white" />
          ) : (
            <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-primary text-3xl font-extrabold text-white shadow-soft ring-4 ring-white">
              {getAvatar(profile.name)}
            </div>
          )}
          <h2 className="mt-5 font-display text-2xl font-bold text-slate-950">{profile.name}</h2>
          <p className="mt-2 text-sm text-slate-500">{profile.email}</p>
          <div className="mt-5 flex justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-blue-700">{profile.role}</span>
          </div>
          {profile.role === 'provider' && (
            <div className="mt-5">
              <div className="flex justify-center"><StarRating value={profile.rating || 0} /></div>
              <p className="mt-2 text-sm font-semibold text-slate-600">{profile.rating || 0} rating · {profile.totalReviews || 0} reviews</p>
            </div>
          )}
          <p className="mt-6 text-sm leading-6 text-slate-500">{profile.bio || 'Add a short bio to help others understand your work.'}</p>
        </Card>

        <Card className="hover:shadow-soft">
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <Input label="Full name" name="name" value={profile.name || ''} onChange={(event) => updateField('name', event.target.value)} />
            <Input label="Email" name="email" value={profile.email || ''} disabled className="cursor-not-allowed bg-slate-50" />
            <div className="md:col-span-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Profile image</span>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50/60 px-4 py-5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
                  <ImagePlus className="h-4 w-4" />
                  Upload image
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </label>
            </div>
            <div className="md:col-span-2">
              <Textarea label="Bio" name="bio" value={profile.bio || ''} onChange={(event) => updateField('bio', event.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Skills</label>
              <div className="flex gap-2">
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
                <Button onClick={addSkill} variant="secondary" className="px-4">Add</Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(profile.skills || []).map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={saving} className="disabled:cursor-not-allowed disabled:opacity-70">
                <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
