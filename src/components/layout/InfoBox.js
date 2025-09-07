export default function InfoBox({ children }) {
  return (
    <div className="text-blue-600 text-center mb-4 mt-4 py-2 rounded font-semibold transition">
      {children}
    </div>
  );
}

export function SuccessBox({ children }) {
  return (
    <div className="text-green-600 text-center mb-4 mt-4 py-2 rounded font-semibold transition">
      {children}
    </div>
  );
}
