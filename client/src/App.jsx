import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import AppShell from "./components/common/AppShell";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import QuizListPage from "./pages/QuizListPage";
import QuizStartPage from "./pages/QuizStartPage";
import AttemptPage from "./pages/AttemptPage";
import ResultPage from "./pages/ResultPage";
import DashboardPage from "./pages/DashboardPage";
import AttemptDetailPage from "./pages/AttemptDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageQuizzesPage from "./pages/admin/ManageQuizzesPage";
import CreateQuizPage from "./pages/admin/CreateQuizPage";
import EditQuizPage from "./pages/admin/EditQuizPage";
import AdminImportQuizPage from "./pages/admin/AdminImportQuizPage";
import AdminAttemptsPage from "./pages/admin/AdminAttemptsPage";
import AdminAttemptDetailPage from "./pages/admin/AdminAttemptDetailPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quizzes" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quizzes/:id" element={<QuizStartPage />} />
          <Route path="/attempts/:attemptId" element={<AttemptPage />} />
          <Route path="/attempts/:attemptId/result" element={<ResultPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/dashboard/attempts/:attemptId"
            element={<AttemptDetailPage />}
          />

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/quizzes" element={<ManageQuizzesPage />} />
            <Route
              path="/admin/quizzes/create"
              element={<CreateQuizPage />}
            />
            <Route
              path="/admin/quizzes/:id/edit"
              element={<EditQuizPage />}
            />
            <Route path="/admin/import" element={<AdminImportQuizPage />} />
            <Route path="/admin/attempts" element={<AdminAttemptsPage />} />
            <Route
              path="/admin/attempts/:attemptId"
              element={<AdminAttemptDetailPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;