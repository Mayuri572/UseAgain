import { useState, useEffect } from "react";

/**
 * Simple math CAPTCHA for demo purposes
 * Production: Replace with reCAPTCHA v3 or hCaptcha
 */
export default function Captcha({ onVerify, onValidate }) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const generate = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setAnswer("");
    setVerified(false);
    setError(false);
  };

  useEffect(() => { generate(); }, []);

  const verify = () => {
    if (parseInt(answer) === num1 + num2) {
      setVerified(true);
      setError(false);
      if (onVerify) onVerify(true);
      if (onValidate) onValidate(true);
    } else {
      setError(true);
      generate();
      if (onVerify) onVerify(false);
      if (onValidate) onValidate(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-neutral rounded-lg border border-gray-200">
      {verified ? (
        <div className="flex items-center gap-2 text-green-600 text-sm font-medium w-full">
          <span className="text-xl">✅</span> Verified!
        </div>
      ) : (
        <>
          <span className="text-sm font-mono font-bold text-text-neutral bg-white px-3 py-1.5 rounded border border-gray-200">
            {num1} + {num2} = ?
          </span>
          <input
            type="number"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className={`w-16 text-center input-field py-1.5 text-sm ${error ? "border-red-400 ring-2 ring-red-200" : ""}`}
            placeholder="?"
            aria-label="CAPTCHA answer"
            onKeyDown={e => e.key === "Enter" && verify()}
          />
          <button
            type="button"
            onClick={verify}
            className="btn-primary text-sm py-1.5 px-3"
          >
            Verify
          </button>
          {error && <span className="text-red-500 text-xs">Try again</span>}
        </>
      )}
    </div>
  );
}
