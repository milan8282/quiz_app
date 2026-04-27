import {
  ArrowLeft,
  Clock,
  FileQuestion,
  PlusCircle,
  Save,
  ToggleLeft,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../common/ErrorMessage";
import QuestionForm from "./QuestionForm";

const createEmptyQuestion = () => ({
  questionText: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  marks: 1,
});

const QuizForm = ({
  mode = "create",
  initialData = null,
  onSubmit,
  submitting = false,
  error = "",
}) => {
  const [form, setForm] = useState(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    durationInMinutes: initialData?.durationInMinutes || 5,
    status: initialData?.status || "active",
    questions:
      initialData?.questions?.length > 0
        ? initialData.questions.map((question) => ({
            questionText: question.questionText || "",
            options: question.options?.length ? question.options : ["", ""],
            correctAnswer: question.correctAnswer || "",
            marks: question.marks || 1,
          }))
        : [createEmptyQuestion()],
  }));

  const totalMarks = useMemo(
    () =>
      form.questions.reduce(
        (sum, question) => sum + Number(question.marks || 0),
        0
      ),
    [form.questions]
  );

  const handleBaseChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "durationInMinutes" ? Number(value) : value,
    }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    setForm((prev) => {
      const updatedQuestions = [...prev.questions];

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value,
      };

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setForm((prev) => {
      const updatedQuestions = [...prev.questions];
      const oldOption = updatedQuestions[questionIndex].options[optionIndex];

      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions[optionIndex] = value;

      const nextQuestion = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };

      if (nextQuestion.correctAnswer === oldOption) {
        nextQuestion.correctAnswer = value;
      }

      updatedQuestions[questionIndex] = nextQuestion;

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, createEmptyQuestion()],
    }));
  };

  const removeQuestion = (questionIndex) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex),
    }));
  };

  const addOption = (questionIndex) => {
    setForm((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: [...updatedQuestions[questionIndex].options, ""],
      };

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    setForm((prev) => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[questionIndex];
      const removedOption = question.options[optionIndex];
      const updatedOptions = question.options.filter(
        (_, index) => index !== optionIndex
      );

      updatedQuestions[questionIndex] = {
        ...question,
        options: updatedOptions,
        correctAnswer:
          question.correctAnswer === removedOption ? "" : question.correctAnswer,
      };

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Quiz title is required";
    if (!form.description.trim()) return "Quiz description is required";
    if (!form.durationInMinutes || form.durationInMinutes < 1) {
      return "Duration must be at least 1 minute";
    }
    if (!form.questions.length) return "At least one question is required";

    for (let index = 0; index < form.questions.length; index += 1) {
      const question = form.questions[index];
      const validOptions = question.options.filter((option) => option.trim());

      if (!question.questionText.trim()) {
        return `Question ${index + 1} text is required`;
      }

      if (validOptions.length < 2) {
        return `Question ${index + 1} must have at least 2 options`;
      }

      if (!question.correctAnswer.trim()) {
        return `Question ${index + 1} correct answer is required`;
      }

      if (!validOptions.includes(question.correctAnswer)) {
        return `Question ${index + 1} correct answer must match an option`;
      }

      if (!question.marks || question.marks < 1) {
        return `Question ${index + 1} marks must be at least 1`;
      }
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      onSubmit(null, validationError);
      return;
    }

    const payload = {
      ...form,
      questions: form.questions.map((question) => ({
        ...question,
        questionText: question.questionText.trim(),
        options: question.options
          .map((option) => option.trim())
          .filter(Boolean),
        correctAnswer: question.correctAnswer.trim(),
        marks: Number(question.marks),
      })),
    };

    onSubmit(payload);
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

        <div className="relative">
          <span className="badge bg-white/10 text-indigo-100">
            <FileQuestion className="h-4 w-4" />
            {mode === "create" ? "Create Quiz" : "Edit Quiz"}
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            {mode === "create"
              ? "Design a premium quiz experience."
              : "Update quiz content and controls."}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Add questions, choices, correct answers, marks, duration, and
            visibility status from one clean workspace.
          </p>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="glass-card rounded-[36px] p-5 md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_220px_180px]">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Quiz Title
              </label>
              <input
                className="input-field"
                name="title"
                value={form.title}
                onChange={handleBaseChange}
                placeholder="JavaScript Advanced Quiz"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Duration
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-field !pl-12"
                  type="number"
                  min="1"
                  name="durationInMinutes"
                  value={form.durationInMinutes}
                  onChange={handleBaseChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Status
              </label>
              <div className="relative">
                <ToggleLeft className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  className="input-field !pl-12"
                  name="status"
                  value={form.status}
                  onChange={handleBaseChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Description
            </label>
            <textarea
              className="input-field min-h-[110px] resize-none"
              name="description"
              value={form.description}
              onChange={handleBaseChange}
              placeholder="Describe what this quiz covers..."
              required
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-5">
              <p className="text-sm font-bold text-slate-400">Questions</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {form.questions.length}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5">
              <p className="text-sm font-bold text-slate-400">Total Marks</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {totalMarks}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5">
              <p className="text-sm font-bold text-slate-400">Duration</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {form.durationInMinutes}m
              </p>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-[36px] p-5 md:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500">
                Question Builder
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Add MCQ Questions
              </h2>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="primary-btn inline-flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Add Question
            </button>
          </div>

          <div className="space-y-5">
            {form.questions.map((question, questionIndex) => (
              <QuestionForm
                key={questionIndex}
                question={question}
                questionIndex={questionIndex}
                onQuestionChange={handleQuestionChange}
                onOptionChange={handleOptionChange}
                onAddOption={addOption}
                onRemoveOption={removeOption}
                onRemoveQuestion={removeQuestion}
                canRemoveQuestion={form.questions.length > 1}
              />
            ))}
          </div>
        </section>

        <div className="glass-card sticky bottom-4 z-20 flex flex-col gap-3 rounded-[28px] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-slate-950">
              {form.questions.length} questions · {totalMarks} marks
            </p>
            <p className="text-sm font-semibold text-slate-500">
              Save only after confirming correct answers.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="primary-btn inline-flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Save className="h-5 w-5" />
            {submitting
              ? "Saving..."
              : mode === "create"
                ? "Create Quiz"
                : "Update Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;