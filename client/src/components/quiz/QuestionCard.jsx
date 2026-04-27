import { CheckCircle2, Circle } from "lucide-react";

const QuestionCard = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}) => {
  return (
    <div className="glass-card rounded-[36px] p-5 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="badge bg-indigo-50 text-indigo-700">
          Question {currentIndex + 1} of {totalQuestions}
        </span>

        <span className="badge bg-slate-100 text-slate-600">
          {question.marks} Mark{question.marks > 1 ? "s" : ""}
        </span>
      </div>

      <h2 className="mt-6 text-2xl font-black leading-snug text-slate-950 md:text-3xl">
        {question.questionText}
      </h2>

      <div className="mt-8 grid gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;

          return (
            <button
              key={`${option}-${index}`}
              type="button"
              onClick={() => onSelectAnswer(option)}
              className={`group flex items-center gap-4 rounded-3xl border p-4 text-left transition md:p-5 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10"
                  : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>

              <p
                className={`flex-1 text-base font-bold ${
                  isSelected ? "text-indigo-950" : "text-slate-700"
                }`}
              >
                {option}
              </p>

              {isSelected ? (
                <CheckCircle2 className="h-6 w-6 text-indigo-600" />
              ) : (
                <Circle className="h-6 w-6 text-slate-300" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;