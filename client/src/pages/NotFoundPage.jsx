import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-card max-w-md rounded-[32px] p-8 text-center">
        <h1 className="text-5xl font-black text-slate-950">404</h1>
        <p className="mt-3 text-slate-600">This page does not exist.</p>
        <Link to="/quizzes" className="primary-btn mt-6 inline-flex">
          Back to App
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;