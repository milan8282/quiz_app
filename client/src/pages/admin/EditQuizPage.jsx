import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminQuizByIdApi,
  updateQuizApi,
} from "../../api/adminApi";
import QuizForm from "../../components/admin/QuizForm";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";

const EditQuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getAdminQuizByIdApi(id);
      setQuiz(data.quiz);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const handleSubmit = async (payload, validationError = "") => {
    setError("");

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      await updateQuizApi(id, payload);
      navigate("/admin/quizzes", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader label="Loading quiz editor..." />;
  }

  if (error && !quiz) {
    return <ErrorMessage message={error} />;
  }

  return (
    <QuizForm
      mode="edit"
      initialData={quiz}
      onSubmit={handleSubmit}
      submitting={submitting}
      error={error}
    />
  );
};

export default EditQuizPage;