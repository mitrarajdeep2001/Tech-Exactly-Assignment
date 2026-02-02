type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const AuthLayout = ({ title, subtitle, children }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        {children}
        <p className="text-red-600 text-xs mt-5">*Note: If you are an admin, login with your credentials from <a className="text-blue-600 underline" href={`/login?isAdmin=${true}`}>here</a> only.</p>
      </div>
    </div>
  );
};

export default AuthLayout;
