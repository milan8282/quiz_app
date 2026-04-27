import csv from "csvtojson";
import Quiz from "../models/Quiz.js";
import asyncHandler from "../utils/asyncHandler.js";

export const importQuizFromFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("File is required");
  }

  let questions = [];

  if (req.file.mimetype === "application/json") {
    questions = JSON.parse(req.file.buffer.toString());
  } else if (req.file.mimetype === "text/csv") {
    const csvData = await csv().fromString(req.file.buffer.toString());

    questions = csvData.map((row) => ({
      questionText: row.question,
      options: [row.option1, row.option2, row.option3, row.option4],
      correctAnswer: row.correctAnswer,
      marks: Number(row.marks || 1),
    }));
  } else {
    res.status(400);
    throw new Error("Only CSV or JSON files allowed");
  }

  const { title, description, durationInMinutes } = req.body;

  if (!title || !description || !durationInMinutes) {
    res.status(400);
    throw new Error("Title, description, duration required");
  }

  const quiz = await Quiz.create({
    title,
    description,
    durationInMinutes,
    questions,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Quiz imported successfully",
    quiz,
  });
});