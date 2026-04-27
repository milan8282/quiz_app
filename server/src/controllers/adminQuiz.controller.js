import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, durationInMinutes, status, questions } = req.body;

  if (!title || !description || !durationInMinutes || !questions?.length) {
    res.status(400);
    throw new Error("Title, description, duration and questions are required");
  }

  const quiz = await Quiz.create({
    title,
    description,
    durationInMinutes,
    status: status || "active",
    questions,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Quiz created successfully",
    quiz,
  });
});

export const getAdminQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find()
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: quizzes.length,
    quizzes,
  });
});

export const getAdminQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate(
    "createdBy",
    "name email role"
  );

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  res.status(200).json({
    success: true,
    quiz,
  });
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const { title, description, durationInMinutes, status, questions } = req.body;

  if (title !== undefined) quiz.title = title;
  if (description !== undefined) quiz.description = description;
  if (durationInMinutes !== undefined) quiz.durationInMinutes = durationInMinutes;
  if (status !== undefined) quiz.status = status;
  if (questions !== undefined) quiz.questions = questions;

  await quiz.save();

  res.status(200).json({
    success: true,
    message: "Quiz updated successfully",
    quiz,
  });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const attemptsCount = await Attempt.countDocuments({ quizId: quiz._id });

  if (attemptsCount > 0) {
    res.status(400);
    throw new Error(
      "This quiz has user attempts, so it cannot be deleted. You can mark it inactive instead."
    );
  }

  await quiz.deleteOne();

  res.status(200).json({
    success: true,
    message: "Quiz deleted successfully",
  });
});

export const updateQuizStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    res.status(400);
    throw new Error("Status must be either active or inactive");
  }

  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  quiz.status = status;
  await quiz.save();

  res.status(200).json({
    success: true,
    message: `Quiz marked as ${status}`,
    quiz,
  });
});