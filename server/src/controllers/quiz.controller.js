import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";
import asyncHandler from "../utils/asyncHandler.js";

const sanitizeQuizForUser = (quiz) => {
  const quizObject = quiz.toObject();

  quizObject.questions = quizObject.questions.map((question) => ({
    _id: question._id,
    questionText: question.questionText,
    options: question.options,
    marks: question.marks,
  }));

  return quizObject;
};

export const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ status: "active" })
    .select("title description durationInMinutes questions status createdAt")
    .sort({ createdAt: -1 });

  const formattedQuizzes = quizzes.map((quiz) => ({
    _id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    durationInMinutes: quiz.durationInMinutes,
    totalQuestions: quiz.questions.length,
    status: quiz.status,
    createdAt: quiz.createdAt,
  }));

  res.status(200).json({
    success: true,
    count: formattedQuizzes.length,
    quizzes: formattedQuizzes,
  });
});

export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({
    _id: req.params.id,
    status: "active",
  });

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found or inactive");
  }

  res.status(200).json({
    success: true,
    quiz: sanitizeQuizForUser(quiz),
  });
});

export const startQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({
    _id: req.params.id,
    status: "active",
  });

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found or inactive");
  }

  const existingAttempt = await Attempt.findOne({
    userId: req.user._id,
    quizId: quiz._id,
    status: "in-progress",
  });

  if (existingAttempt) {
    if (new Date() >= existingAttempt.expiresAt) {
      existingAttempt.status = "expired";
      await calculateAndSaveResult(existingAttempt, quiz);

      return res.status(200).json({
        success: true,
        message: "Quiz time expired. Result generated.",
        attempt: existingAttempt,
        redirectToResult: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Existing quiz attempt resumed",
      attempt: existingAttempt,
      redirectToResult: false,
    });
  }

  const startedAt = new Date();
  const expiresAt = new Date(
    startedAt.getTime() + quiz.durationInMinutes * 60 * 1000
  );

  const attempt = await Attempt.create({
    userId: req.user._id,
    quizId: quiz._id,
    startedAt,
    expiresAt,
    status: "in-progress",
    totalMarks: quiz.questions.reduce((sum, question) => sum + question.marks, 0),
  });

  res.status(201).json({
    success: true,
    message: "Quiz attempt started",
    attempt,
    redirectToResult: false,
  });
});

export const calculateAndSaveResult = async (attempt, quiz) => {
  const submittedAnswersMap = new Map();

  attempt.answers.forEach((answer) => {
    submittedAnswersMap.set(answer.questionId.toString(), answer.selectedAnswer);
  });

  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  const finalAnswers = quiz.questions.map((question) => {
    const selectedAnswer = submittedAnswersMap.get(question._id.toString());

    if (!selectedAnswer) {
      unansweredCount += 1;

      return {
        questionId: question._id,
        selectedAnswer: "",
        isCorrect: false,
        marksEarned: 0,
      };
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    const marksEarned = isCorrect ? question.marks : 0;

    if (isCorrect) {
      correctCount += 1;
      score += marksEarned;
    } else {
      wrongCount += 1;
    }

    return {
      questionId: question._id,
      selectedAnswer,
      isCorrect,
      marksEarned,
    };
  });

  const totalMarks = quiz.questions.reduce(
    (sum, question) => sum + question.marks,
    0
  );

  attempt.answers = finalAnswers;
  attempt.score = score;
  attempt.totalMarks = totalMarks;
  attempt.percentage =
    totalMarks > 0 ? Number(((score / totalMarks) * 100).toFixed(2)) : 0;
  attempt.correctCount = correctCount;
  attempt.wrongCount = wrongCount;
  attempt.unansweredCount = unansweredCount;

  if (!attempt.submittedAt) {
    attempt.submittedAt = new Date();
  }

  await attempt.save();
  return attempt;
};