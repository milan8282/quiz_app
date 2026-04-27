import {
  ArrowLeft,
  CheckCircle2,
  FileJson,
  FileSpreadsheet,
  Info,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { importQuizApi } from "../../api/adminApi";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminImportQuizPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    durationInMinutes: 5,
    file: null,
  });

  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "file") {
      const selectedFile = files?.[0] || null;

      setForm((prev) => ({
        ...prev,
        file: selectedFile,
      }));

      setFileName(selectedFile?.name || "");
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === "durationInMinutes" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Quiz title is required");
      return;
    }

    if (!form.description.trim()) {
      setError("Quiz description is required");
      return;
    }

    if (!form.durationInMinutes || form.durationInMinutes < 1) {
      setError("Duration must be at least 1 minute");
      return;
    }

    if (!form.file) {
      setError("Please select a CSV or JSON file");
      return;
    }

    const allowedTypes = [
      "text/csv",
      "application/json",
      "application/vnd.ms-excel",
    ];

    const hasAllowedExtension =
      form.file.name.endsWith(".csv") || form.file.name.endsWith(".json");

    if (!allowedTypes.includes(form.file.type) && !hasAllowedExtension) {
      setError("Only CSV or JSON files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("durationInMinutes", String(form.durationInMinutes));
    formData.append("file", form.file);

    setSubmitting(true);

    try {
      await importQuizApi(formData);
      navigate("/admin/quizzes", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to import quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/admin/quizzes"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to quizzes
      </Link>

      <section className="relative overflow-hidden rounded-[40px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 md:p-8">
        <div className="absolute right-[-100px] top-[-100px] h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[20%] h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="badge bg-white/10 text-indigo-100">
              <UploadCloud className="h-4 w-4" />
              Bulk Import
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              Import MCQ questions from CSV or JSON.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Quickly create a full quiz by uploading a structured question
              bank. The backend validates options, correct answers, marks, and
              quiz details.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
                <FileSpreadsheet className="h-7 w-7" />
              </div>
              <div>
                <p className="text-2xl font-black">CSV / JSON</p>
                <p className="text-sm font-semibold text-slate-300">
                  Supported question bank formats
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <form onSubmit={handleSubmit} className="glass-card rounded-[36px] p-5 md:p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500">
              Quiz Details
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Upload Question Bank
            </h2>
          </div>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Quiz Title
              </label>
              <input
                className="input-field"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Imported JavaScript Quiz"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Description
              </label>
              <textarea
                className="input-field min-h-[120px] resize-none"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Explain what this quiz covers..."
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Duration in Minutes
              </label>
              <input
                className="input-field"
                type="number"
                min="1"
                name="durationInMinutes"
                value={form.durationInMinutes}
                onChange={handleChange}
                required
              />
            </div>

            <label className="group cursor-pointer rounded-[32px] border-2 border-dashed border-slate-300 bg-white p-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
              <input
                type="file"
                name="file"
                accept=".csv,.json,text/csv,application/json"
                onChange={handleChange}
                className="hidden"
              />

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/25">
                <UploadCloud className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-950">
                {fileName || "Choose CSV or JSON file"}
              </h3>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Maximum recommended file size: 5MB
              </p>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="primary-btn mt-6 flex w-full items-center justify-center gap-2 disabled:opacity-70"
          >
            <UploadCloud className="h-5 w-5" />
            {submitting ? "Importing Quiz..." : "Import Quiz"}
          </button>
        </form>

        <aside className="space-y-5">
          <div className="glass-card rounded-[32px] p-5">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-7 w-7 text-emerald-600" />
              <h3 className="text-xl font-black text-slate-950">
                CSV Format
              </h3>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl bg-slate-950 p-4 text-xs font-semibold leading-6 text-slate-200">
              <pre className="overflow-x-auto">{`question,option1,option2,option3,option4,correctAnswer,marks
What is JS?,Language,Framework,Database,Tool,Language,1
React is?,Library,Language,OS,Server,Library,1`}</pre>
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-5">
            <div className="flex items-center gap-3">
              <FileJson className="h-7 w-7 text-indigo-600" />
              <h3 className="text-xl font-black text-slate-950">
                JSON Format
              </h3>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl bg-slate-950 p-4 text-xs font-semibold leading-6 text-slate-200">
              <pre className="overflow-x-auto">{`[
  {
    "questionText": "What is JavaScript?",
    "options": ["Language", "DB", "Tool", "OS"],
    "correctAnswer": "Language",
    "marks": 1
  }
]`}</pre>
            </div>
          </div>

          <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-black text-amber-900">
                  Important Import Rules
                </h3>
                <div className="mt-3 space-y-2">
                  {[
                    "Correct answer must exactly match one of the options.",
                    "Every question needs at least 2 valid options.",
                    "Marks should be a positive number.",
                    "CSV header names must match the sample format.",
                  ].map((item) => (
                    <div key={item} className="flex gap-2 text-sm font-semibold text-amber-800">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminImportQuizPage;