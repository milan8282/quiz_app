import { CheckCircle2, Circle, XCircle } from "lucide-react";

const QuestionReviewCard = ({ question, index }) => {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="badge bg-slate-100 text-slate-600">
            Question {index + 1}
          </span>
          <h3 className="mt-4 text-xl font-black text-slate-950">
            {question.questionText}
          </h3>
        </div>

        <span
          className={`badge ${
            question.isCorrect
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {question.isCorrect ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {question.isCorrect ? "Correct" : "Wrong"}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {question.options.map((option, optionIndex) => {
          const isCorrectAnswer = option === question.correctAnswer;
          const isSelectedAnswer = option === question.selectedAnswer;

          return (
            <div
              key={`${option}-${optionIndex}`}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                isCorrectAnswer
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : isSelectedAnswer
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                  isCorrectAnswer
                    ? "bg-emerald-600 text-white"
                    : isSelectedAnswer
                      ? "bg-red-600 text-white"
                      : "bg-white text-slate-500"
                }`}
              >
                {String.fromCharCode(65 + optionIndex)}
              </div>

              <p className="flex-1 text-sm font-bold">{option}</p>

              {isCorrectAnswer ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : isSelectedAnswer ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-3">
        <div>
          <p className="font-bold text-slate-400">Your Answer</p>
          <p className="mt-1 font-black text-slate-950">
            {question.selectedAnswer || "Not answered"}
          </p>
        </div>

        <div>
          <p className="font-bold text-slate-400">Correct Answer</p>
          <p className="mt-1 font-black text-emerald-700">
            {question.correctAnswer}
          </p>
        </div>

        <div>
          <p className="font-bold text-slate-400">Marks</p>
          <p className="mt-1 font-black text-slate-950">
            {question.marksEarned}/{question.marks}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionReviewCard;