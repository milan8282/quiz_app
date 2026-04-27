import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator(options) {
          return (
            Array.isArray(options) &&
            options.filter((option) => option && option.trim()).length >= 2
          );
        },
        message: "Each question must have at least 2 options",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      trim: true,
    },
    marks: {
      type: Number,
      default: 1,
      min: [1, "Marks must be at least 1"],
    },
  },
  { timestamps: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Quiz description is required"],
      trim: true,
    },
    durationInMinutes: {
      type: Number,
      required: [true, "Quiz duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator(questions) {
          return Array.isArray(questions) && questions.length > 0;
        },
        message: "Quiz must have at least one question",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

quizSchema.pre("validate", function () {
  for (const question of this.questions) {
    const cleanOptions = question.options
      .map((option) => option.trim())
      .filter(Boolean);

    question.options = cleanOptions;
    question.correctAnswer = question.correctAnswer.trim();

    if (!cleanOptions.includes(question.correctAnswer)) {
      throw new Error(
        `Correct answer must exist inside options for question: ${question.questionText}`
      );
    }
  }
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;