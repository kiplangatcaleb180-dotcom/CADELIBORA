import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { fetchApi } from '../lib/api';

export const Contact: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const submitInquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setFeedback(null);
    try {
      const result = await fetchApi<{ success: boolean; message: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      });
      setFeedback({ success: true, message: result.message || 'Your message has been sent.' });
      form.reset();
    } catch (error) {
      setFeedback({ success: false, message: error instanceof Error ? error.message : 'Unable to send your message.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl mb-12">
          <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest mb-3">
            Contact CADELIBORA
          </p>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            Let&apos;s build what comes next.
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed">
            Have a question, partnership idea, research opportunity, or career
            inquiry? Reach out to the CADELIBORA team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-cyan-400 mt-1" />
                <div>
                  <h2 className="font-bold text-lg">Email</h2>
                  <p className="text-slate-400 mt-1">
                    Reach our team for general inquiries and collaborations.
                  </p>
                  <a
                    href="mailto:hello@cadelibora.com"
                    className="inline-block mt-3 text-cyan-400 hover:text-cyan-300"
                  >
                    hello@cadelibora.com
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-cyan-400 mt-1" />
                <div>
                  <h2 className="font-bold text-lg">Location</h2>
                  <p className="text-slate-400 mt-1">
                    CADELIBORA operates as a technology, research, and
                    education-focused organization.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-cyan-400 mt-1" />
                <div>
                  <h2 className="font-bold text-lg">General inquiries</h2>
                  <p className="text-slate-400 mt-1">
                    For partnerships, projects, research, and other inquiries,
                    use the contact form.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6"
            onSubmit={submitInquiry}
          >
            {feedback && <p role="status" className={`rounded-xl border p-3 text-sm ${feedback.success ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>{feedback.message}</p>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={120}
                placeholder="Your name"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                maxLength={200}
                placeholder="How can we help?"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                maxLength={10000}
                placeholder="Tell us more..."
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 transition-colors"
            >
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
