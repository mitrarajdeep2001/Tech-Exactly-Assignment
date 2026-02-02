type Props = {
  password: string;
  visible: boolean;
};

const rules = {
  length: (v: string) => v.length >= 8,
  upper: (v: string) => /[A-Z]/.test(v),
  lower: (v: string) => /[a-z]/.test(v),
  number: (v: string) => /[0-9]/.test(v),
  special: (v: string) => /[^A-Za-z0-9]/.test(v),
};

const RuleItem = ({ valid, label }: { valid: boolean; label: string }) => (
  <div className="flex items-center gap-2 text-sm">
    <span
      className={`h-2 w-2 rounded-full ${
        valid ? "bg-green-500" : "bg-slate-300"
      }`}
    />
    <span className={valid ? "text-slate-800" : "text-slate-500"}>
      {label}
    </span>
  </div>
);

const PasswordStrength = ({ password, visible }: Props) => {
  if (!visible) return null;

  return (
    <div className="absolute z-10 mt-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-xs font-medium text-slate-500">
        Password must contain:
      </p>

      <div className="space-y-2">
        <RuleItem
          valid={rules.length(password)}
          label="At least 8 characters"
        />
        <RuleItem
          valid={rules.upper(password)}
          label="One uppercase letter (A–Z)"
        />
        <RuleItem
          valid={rules.lower(password)}
          label="One lowercase letter (a–z)"
        />
        <RuleItem
          valid={rules.number(password)}
          label="One number (0–9)"
        />
        <RuleItem
          valid={rules.special(password)}
          label="One special character"
        />
      </div>
    </div>
  );
};

export default PasswordStrength;
