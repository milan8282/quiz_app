import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flag,
  ListChecks,
  Send,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAttemptApi,
  saveAnswerApi,
  submitAttemptApi,
} from "../api/attemptApi";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import QuestionCard from "../components/quiz/QuestionCard";
import QuizTimer from "../components/quiz/QuizTimer";

const AttemptPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [serverTime, setServerTime] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingQuestionId, setSavingQuestionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const hydrateAnswers = (attemptData) => {
    const mappedAnswers = {};

    attemptData?.answers?.forEach((answer) => {
      if (answer.selectedAnswer) {
        mappedAnswers[answer.questionId] = answer.selectedAnswer;
      }
    });

    setAnswers(mappedAnswers);
  };

  const fetchAttempt = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getAttemptApi(attemptId);

      if (data.redirectToResult) {
        navigate(`/attempts/${attemptId}/result`, { replace: true });
        return;
      }

      setAttempt(data.attempt);
      setQuiz(data.quiz);
      setServerTime(data.serverTime);
      hydrateAnswers(data.attempt);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load quiz attempt");
    } finally {
      setLoading(false);
    }
  }, [attemptId, navigate]);

  useEffect(() => {
    fetchAttempt();
  }, [fetchAttempt]);

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(
    () => Object.keys(answers).filter(Boolean).length,
    [answers]
  );

  const progress = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const selectedAnswer = currentQuestion ? answers[currentQuestion._id] : "";

  const handleSelectAnswer = async (selectedOption) => {
    if (!currentQuestion) return;

    const questionId = currentQuestion._id;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));

    setSavingQuestionId(questionId);
    setError("");

    try {
      await saveAnswerApi(attemptId, {
        questionId,
        selectedAnswer: selectedOption,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save answer");
    } finally {
      setSavingQuestionId("");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      await submitAttemptApi(attemptId);
      navigate(`/attempts/${attemptId}/result`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExpire = useCallback(() => {
    navigate(`/attempts/${attemptId}/result`, { replace: true });
  }, [attemptId, navigate]);

  if (loading) {
    return <Loader label="Preparing your quiz session..." />;
  }

  if (error && !quiz) {
    return <ErrorMessage message={error} />;
  }

  if (!quiz || !attempt || !currentQuestion) {
    return <ErrorMessage message="Quiz session not found" />;
  }

  return (
    <div className="space-y-6">
      <section className="glass-card sticky top-[104px] z-20 rounded-[32px] p-4 md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500">
              Live Quiz Session
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">
              {quiz.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-slate-100 px-4 py-3">
              <p className="text-xs font-bold text-slate-500">Answered</p>
              <p className="font-black text-slate-950">
                {answeredCount}/{questions.length}
              </p>
            </div>

            <QuizTimer
              expiresAt={attempt.expiresAt}
              serverTime={serverTime}
              onExpire={handleExpire}
            />
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <QuestionCard
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
          />

          <div className="glass-card flex flex-col gap-3 rounded-[28px] p-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="secondary-btn flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5" />
              Previous
            </button>

            <div className="text-center text-sm font-bold text-slate-500">
              {savingQuestionId === currentQuestion._id
                ? "Saving answer..."
                : selectedAnswer
                  ? "Answer saved"
                  : "Select an answer to save progress"}
            </div>

            {currentIndex === questions.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="primary-btn flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <Send className="h-5 w-5" />
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
                className="primary-btn flex items-center justify-center gap-2"
              >
                Next
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <aside className="glass-card h-fit rounded-[32px] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <ListChecks className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-950">Question Map</h3>
              <p className="text-sm font-semibold text-slate-500">
                Jump between questions
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const isActive = index === currentIndex;
              const isAnswered = Boolean(answers[question._id]);

              return (
                <button
                  key={question._id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`flex h-12 items-center justify-center rounded-2xl text-sm font-black transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : isAnswered
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {isAnswered && !isActive ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-3">
              <Flag className="h-5 w-5 text-indigo-300" />
              <p className="font-black">Submit carefully</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Once submitted, you cannot update answers. Unanswered questions
              will count as wrong.
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:opacity-70"
            >
              {submitting ? "Submitting..." : "Final Submit"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AttemptPage;