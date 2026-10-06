import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { GraduationCap, Clock, Award, PlayCircle, Search, Sparkles, Filter } from 'lucide-react';
import Avatar from '../components/ui/Avatar';

export const Academy: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    try {
      let query = `/courses?`;
      if (search) query += `search=${encodeURIComponent(search)}&`;
      if (category) query += `category=${encodeURIComponent(category)}&`;

      const res = await fetchApi<{ courses: any[] }>(query);
      setCourses(res.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono rounded-full font-semibold">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span>CADELIBORA Academy & Fellowship</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Digital Learning Platform</h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Master large language model engineering, cybersecurity, quantum computing, and distributed systems with peer-reviewed curriculum and verifiable certificates.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-brand-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadCourses()}
            className="bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-full sm:w-64"
          />
        </div>

        <div className="flex gap-2 text-xs font-mono w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {['', 'Artificial Intelligence', 'Cybersecurity'].map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-brand-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat || 'All Categories'}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <p className="text-center py-12 text-brand-400 text-sm font-mono animate-pulse">Loading CADELIBORA Academy Catalog...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="p-8 rounded-3xl glass-panel glass-panel-hover border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-2xl overflow-hidden relative bg-slate-900 flex items-center justify-center">
                  {course.coverImage ? (
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs font-mono text-slate-500">
                      CADELIBORA Academy
                    </span>
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-[10px] font-mono text-brand-400 font-bold border border-slate-800">
                    {course.category}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-400" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-emerald-400" /> {course.level}</span>
                    <span>{course.lessons?.length || 0} Lessons</span>
                  </div>
                  <h3 className="text-xl font-bold text-white hover:text-brand-400 transition-colors">{course.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{course.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={course.instructor?.fullName} src={course.instructor?.avatarUrl} className="w-7 h-7 rounded-lg" />
                  <span className="text-xs font-semibold text-slate-300">{course.instructor?.fullName}</span>
                </div>

                <Link
                  to={`/academy/courses/${course.slug}`}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Course</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
