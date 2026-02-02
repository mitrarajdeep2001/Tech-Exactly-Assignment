type Props = {
  label: string;
  onClick?: () => void;
};

const GoogleButton = ({ label, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      {label}
    </button>
  );
};

export default GoogleButton;
