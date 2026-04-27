import { ArrowRight, Clock, FileQuestion, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const QuizCard = ({ quiz }) => {
  return (
    <Link
      to={`/quizzes/${quiz._id}`}
      className="group relative overflow-hidden rounded-[32px] border border-white/80 bg-white p-6 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      <div className="absolute right-[-40px] top-[-40px] h-32 w-32 rounded-full bg-indigo-100 transition group-hover:scale-125" />
      <div className="absolute bottom-[-50px] left-[-50px] h-36 w-36 rounded-full bg-sky-100 transition group-hover:scale-125" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/25">
            <FileQuestion className="h-7 w-7" />
          </div>

          <span className="badge bg-emerald-50 text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Active
          </span>
        </div>

        <h3 className="mt-6 line-clamp-2 text-2xl font-black tracking-tight text-slate-950">
          {quiz.title}
        </h3>

        <p className="mt-3 line-clamp-3 min-h-[72px] text-sm font-medium leading-6 text-slate-500">
          {quiz.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Questions
            </p>
            <p className="mt-1 text-xl font-black text-slate-950">
              {quiz.totalQuestions}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              Time
            </p>
            <p className="mt-1 text-xl font-black text-slate-950">
              {quiz.durationInMinutes}m
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-white">
          <span className="text-sm font-black">Start Assessment</span>
          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default QuizCard;