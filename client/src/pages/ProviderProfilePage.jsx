import { BadgeCheck, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';
import Textarea from '../components/Textarea';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileApi, reviewApi } from '../services/profileApi';

export default function ProviderProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const canReview = user?.role === 'user';

  async function loadProfile() {
    setLoading(true);

    try {
      const [profileResult, reviewResult] = await Promise.all([
        profileApi.getUser(id),
        reviewApi.getProviderReviews(id),
      ]);
      setProvider(profileResult.data.user);
      setReviews(reviewResult.data.reviews || []);
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to load provider profile.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [id]);

  async function submitReview(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await reviewApi.create({ providerId: id, rating, comment });
      setComment('');
      pushToast('Review submitted successfully.');
      await loadProfile();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <DashboardLayout title="Provider Profile" subtitle="Review provider details."><Card><Loader label="Loading provider" /></Card></DashboardLayout>;
  }

  if (!provider) {
    return <DashboardLayout title="Provider Profile" subtitle="Review provider details."><EmptyState title="Provider not found" description="This provider profile could not be loaded." /></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Provider Profile" subtitle="Ratings, skills, bio, and provider reviews.">
      <div className="mx-auto grid max-w-5xl gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="h-fit text-center hover:shadow-soft">
          {provider.profileImage ? (
            <img src={provider.profileImage} alt={provider.name} className="mx-auto h-32 w-32 rounded-full object-cover shadow-soft ring-4 ring-white" />
          ) : (
            <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-primary text-3xl font-extrabold text-white shadow-soft ring-4 ring-white">
              {provider.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
          <h2 className="mt-5 font-display text-2xl font-bold text-slate-950">{provider.name}</h2>
          <p className="mt-2 text-sm text-slate-500">{provider.email}</p>
          <div className="mt-5 flex justify-center">
            <StarRating value={provider.rating || 0} />
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-600">{provider.rating || 0} rating · {provider.totalReviews || 0} reviews</p>
          <div className="mt-5 flex justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <BadgeCheck className="h-3.5 w-3.5" /> Provider
            </span>
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-500">{provider.bio || 'No bio added yet.'}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {(provider.skills || []).map((skill) => (
              <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{skill}</span>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          {canReview && (
            <Card className="hover:shadow-soft">
              <h2 className="font-display text-xl font-bold text-slate-950">Leave a review</h2>
              <form onSubmit={submitReview} className="mt-5 space-y-5">
                <StarRating value={rating} onChange={setRating} size="h-6 w-6" />
                <Textarea label="Comment" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share what it was like working with this provider." />
                <Button type="submit" disabled={submitting} className="disabled:cursor-not-allowed disabled:opacity-70">
                  <Send className="h-4 w-4" /> {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            </Card>
          )}

          <Card className="hover:shadow-soft">
            <h2 className="font-display text-xl font-bold text-slate-950">Reviews</h2>
            {reviews.length === 0 ? (
              <div className="mt-5"><EmptyState title="No reviews yet" description="Reviews will appear after clients rate this provider." /></div>
            ) : (
              <div className="mt-5 space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-lg bg-white/85 p-4 shadow-soft">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-950">{review.userId?.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <StarRating value={review.rating} size="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment || 'No comment provided.'}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
