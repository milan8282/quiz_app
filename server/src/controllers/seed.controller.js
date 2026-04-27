import Quiz from "../models/Quiz.js";
import asyncHandler from "../utils/asyncHandler.js";

export const seedQuizzes = asyncHandler(async (req, res) => {
  const quizzes = [
    {
      title: "JavaScript Basics",
      description: "Test your basic JavaScript knowledge.",
      durationInMinutes: 5,
      status: "active",
      createdBy: req.user._id,
      questions: [
        {
          questionText: "Which keyword is used to declare a constant?",
          options: ["var", "let", "const", "define"],
          correctAnswer: "const",
          marks: 1
        },
        {
          questionText: "Which method converts JSON string into object?",
          options: ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.convert()"],
          correctAnswer: "JSON.parse()",
          marks: 1
        },
        {
          questionText: "Which value represents nothing in JavaScript?",
          options: ["null", "zero", "empty", "blank"],
          correctAnswer: "null",
          marks: 1
        }
      ]
    },
    {
      title: "React Fundamentals",
      description: "Check your React hooks and component knowledge.",
      durationInMinutes: 7,
      status: "active",
      createdBy: req.user._id,
      questions: [
        {
          questionText: "Which hook is used for state management?",
          options: ["useEffect", "useState", "useMemo", "useRef"],
          correctAnswer: "useState",
          marks: 1
        },
        {
          questionText: "React components must return what?",
          options: ["HTML file", "JSX", "CSS", "JSON only"],
          correctAnswer: "JSX",
          marks: 1
        },
        {
          questionText: "Which hook runs side effects?",
          options: ["useState", "useEffect", "useCallback", "useId"],
          correctAnswer: "useEffect",
          marks: 1
        }
      ]
    },
    {
      title: "Node.js and Express",
      description: "Basic backend development quiz.",
      durationInMinutes: 6,
      status: "active",
      createdBy: req.user._id,
      questions: [
        {
          questionText: "Which framework is commonly used with Node.js for APIs?",
          options: ["Laravel", "Django", "Express", "Rails"],
          correctAnswer: "Express",
          marks: 1
        },
        {
          questionText: "Which method is used to parse JSON body in Express?",
          options: ["express.json()", "express.body()", "app.json()", "parse.json()"],
          correctAnswer: "express.json()",
          marks: 1
        },
        {
          questionText: "Which object contains route parameters?",
          options: ["req.body", "req.params", "req.query", "req.headers"],
          correctAnswer: "req.params",
          marks: 1
        }
      ]
    }
  ];

  await Quiz.deleteMany({});
  const createdQuizzes = await Quiz.insertMany(quizzes);

  res.status(201).json({
    success: true,
    message: "Seed quizzes inserted successfully",
    count: createdQuizzes.length,
    quizzes: createdQuizzes
  });
});