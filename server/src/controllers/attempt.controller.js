import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculateAndSaveResult } from "./quiz.controller.js";

const ensureAttemptOwnerOrAdmin = (attempt, user) => {
  if (
    user.role !== "admin" &&
    attempt.userId.toString() !== user._id.toString()
  ) {
    throw new Error("You are not allowed to access this attempt");
  }
};

const buildResultResponse = (attempt, quiz) => {
  const answerMap = new Map();

  attempt.answers.forEach((answer) => {
    answerMap.set(answer.questionId.toString(), answer);
  });

  const questions = quiz.questions.map((question) => {
    const answer = answerMap.get(question._id.toString());

    return {
      questionId: question._id,
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      selectedAnswer: answer?.selectedAnswer || "",
      isCorrect: answer?.isCorrect || false,
      marks: question.marks,
      marksEarned: answer?.marksEarned || 0,
    };
  });

  return {
    _id: attempt._id,
    quiz: {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      durationInMinutes: quiz.durationInMinutes,
    },
    status: attempt.status,
    startedAt: attempt.startedAt,
    expiresAt: attempt.expiresAt,
    submittedAt: attempt.submittedAt,
    score: attempt.score,
    totalMarks: attempt.totalMarks,
    percentage: attempt.percentage,
    correctCount: attempt.correctCount,
    wrongCount: attempt.wrongCount,
    unansweredCount: attempt.unansweredCount,
    questions,
  };
};

const finalizeIfExpired = async (attempt, quiz) => {
  if (attempt.status === "in-progress" && new Date() >= attempt.expiresAt) {
    attempt.status = "expired";
    await calculateAndSaveResult(attempt, quiz);
  }

  return attempt;
};

export const getAttemptById = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.attemptId);

  if (!attempt) {
    res.status(404);
    throw new Error("Attempt not found");
  }

  ensureAttemptOwnerOrAdmin(attempt, req.user);

  const quiz = await Quiz.findById(attempt.quizId);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  await finalizeIfExpired(attempt, quiz);

  const safeQuiz = quiz.toObject();
  safeQuiz.questions = safeQuiz.questions.map((question) => ({
    _id: question._id,
    questionText: question.questionText,
    options: question.options,
    marks: question.marks,
  }));

  res.status(200).json({
    success: true,
    attempt,
    quiz: safeQuiz,
    serverTime: new Date(),
    redirectToResult: attempt.status !== "in-progress",
  });
});

export const saveAnswer = asyncHandler(async (req, res) => {
  const { questionId, selectedAnswer } = req.body;

  if (!questionId || !selectedAnswer) {
    res.status(400);
    throw new Error("Question ID and selected answer are required");
  }

  const attempt = await Attempt.findById(req.params.attemptId);

  if (!attempt) {
    res.status(404);
    throw new Error("Attempt not found");
  }

  ensureAttemptOwnerOrAdmin(attempt, req.user);

  const quiz = await Quiz.findById(attempt.quizId);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  await finalizeIfExpired(attempt, quiz);

  if (attempt.status !== "in-progress") {
    res.status(400);
    throw new Error("Quiz attempt is already completed or expired");
  }

  const question = quiz.questions.id(questionId);

  if (!question) {
    res.status(400);
    throw new Error("Invalid question ID");
  }

  if (!question.options.includes(selectedAnswer)) {
    res.status(400);
    throw new Error("Selected answer is not a valid option");
  }

  const existingAnswerIndex = attempt.answers.findIndex(
    (answer) => answer.questionId.toString() === questionId
  );

  const answerPayload = {
    questionId,
    selectedAnswer,
    isCorrect: false,
    marksEarned: 0,
  };

  if (existingAnswerIndex >= 0) {
    attempt.answers[existingAnswerIndex] = answerPayload;
  } else {
    attempt.answers.push(answerPayload);
  }

  await attempt.save();

  res.status(200).json({
    success: true,
    message: "Answer saved successfully",
    attempt,
    serverTime: new Date(),
  });
});

export const submitAttempt = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.attemptId);

  if (!attempt) {
    res.status(404);
    throw new Error("Attempt not found");
  }

  ensureAttemptOwnerOrAdmin(attempt, req.user);

  const quiz = await Quiz.findById(attempt.quizId);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  await finalizeIfExpired(attempt, quiz);

  if (attempt.status !== "in-progress") {
    return res.status(200).json({
      success: true,
      message: "Quiz already completed",
      attempt,
    });
  }

  attempt.status = "submitted";
  attempt.submittedAt = new Date();

  await calculateAndSaveResult(attempt, quiz);

  res.status(200).json({
    success: true,
    message: "Quiz submitted successfully",
    attempt,
  });
});

export const getAttemptResult = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.attemptId);

  if (!attempt) {
    res.status(404);
    throw new Error("Attempt not found");
  }

  ensureAttemptOwnerOrAdmin(attempt, req.user);

  const quiz = await Quiz.findById(attempt.quizId);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  await finalizeIfExpired(attempt, quiz);

  if (attempt.status === "in-progress") {
    res.status(400);
    throw new Error("Quiz is still in progress");
  }

  res.status(200).json({
    success: true,
    result: buildResultResponse(attempt, quiz),
  });
});

export const getUserDashboard = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ userId: req.user._id })
    .populate("quizId", "title description durationInMinutes")
    .sort({ createdAt: -1 });

  const totalAttempts = attempts.length;
  const completedAttempts = attempts.filter(
    (attempt) => attempt.status === "submitted" || attempt.status === "expired"
  );

  const averagePercentage =
    completedAttempts.length > 0
      ? Number(
          (
            completedAttempts.reduce(
              (sum, attempt) => sum + attempt.percentage,
              0
            ) / completedAttempts.length
          ).toFixed(2)
        )
      : 0;

  res.status(200).json({
    success: true,
    stats: {
      totalAttempts,
      completedAttempts: completedAttempts.length,
      inProgressAttempts: attempts.filter(
        (attempt) => attempt.status === "in-progress"
      ).length,
      averagePercentage,
    },
    attempts,
  });
});

export const getUserAttempts = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ userId: req.user._id })
    .populate("quizId", "title description durationInMinutes")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: attempts.length,
    attempts,
  });
});

export const getAdminAttempts = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find()
    .populate("userId", "name email role")
    .populate("quizId", "title description durationInMinutes")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: attempts.length,
    attempts,
  });
});

export const getAdminAttemptDetail = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.attemptId).populate(
    "userId",
    "name email role"
  );

  if (!attempt) {
    res.status(404);
    throw new Error("Attempt not found");
  }

  const quiz = await Quiz.findById(attempt.quizId);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  await finalizeIfExpired(attempt, quiz);

  res.status(200).json({
    success: true,
    attemptUser: attempt.userId,
    result: buildResultResponse(attempt, quiz),
  });
});