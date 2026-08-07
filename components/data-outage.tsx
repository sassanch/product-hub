"use client";

export function DataOutage({ retry }: { retry?: () => void }) {
  const tryAgain = retry ?? (() => window.location.reload());
  return <main className="error-page"><div><h2>Product data is temporarily unavailable.</h2><p>We couldn’t reach the live roadmap source. No preview data is being shown.</p><button onClick={tryAgain}>Try again</button></div></main>;
}
