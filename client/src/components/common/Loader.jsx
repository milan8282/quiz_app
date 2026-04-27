const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="glass-card flex items-center gap-4 rounded-3xl px-6 py-5">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        <p className="font-semibold text-slate-700">{label}</p>
      </div>
    </div>
  );
};

export default Loader;