import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuizApi } from "../../api/adminApi";
import QuizForm from "../../components/admin/QuizForm";

const CreateQuizPage = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (payload, validationError = "") => {
    setError("");

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      await createQuizApi(payload);
      navigate("/admin/quizzes", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <QuizForm
      mode="create"
      onSubmit={handleSubmit}
      submitting={submitting}
      error={error}
    />
  );
};

export default CreateQuizPage;