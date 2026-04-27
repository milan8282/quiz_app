import { Plus, Trash2 } from "lucide-react";

const QuestionForm = ({
  question,
  questionIndex,
  onQuestionChange,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onRemoveQuestion,
  canRemoveQuestion,
}) => {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="badge bg-indigo-50 text-indigo-700">
          Question {questionIndex + 1}
        </span>

        {canRemoveQuestion && (
          <button
            type="button"
            onClick={() => onRemoveQuestion(questionIndex)}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>

      <div className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Question Text
          </label>
          <textarea
            className="input-field min-h-[110px] resize-none"
            placeholder="Enter your question..."
            value={question.questionText}
            onChange={(event) =>
              onQuestionChange(questionIndex, "questionText", event.target.value)
            }
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_160px]">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Correct Answer
            </label>
            <select
              className="input-field"
              value={question.correctAnswer}
              onChange={(event) =>
                onQuestionChange(
                  questionIndex,
                  "correctAnswer",
                  event.target.value
                )
              }
              required
            >
              <option value="">Select correct answer</option>
              {question.options
                .filter((option) => option.trim())
                .map((option, index) => (
                  <option key={`${option}-${index}`} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Marks
            </label>
            <input
              className="input-field"
              type="number"
              min="1"
              value={question.marks}
              onChange={(event) =>
                onQuestionChange(
                  questionIndex,
                  "marks",
                  Number(event.target.value)
                )
              }
              required
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="block text-sm font-bold text-slate-700">
              Options
            </label>

            <button
              type="button"
              onClick={() => onAddOption(questionIndex)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </button>
          </div>

          <div className="grid gap-3">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 font-black text-slate-500">
                  {String.fromCharCode(65 + optionIndex)}
                </div>

                <input
                  className="input-field"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(event) =>
                    onOptionChange(
                      questionIndex,
                      optionIndex,
                      event.target.value
                    )
                  }
                  required
                />

                {question.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => onRemoveOption(questionIndex, optionIndex)}
                    className="rounded-2xl bg-red-50 px-4 text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;