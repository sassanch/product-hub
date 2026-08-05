"use client";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="error-page"><div><h2>The roadmap couldn’t load.</h2><p>Linear may be temporarily unavailable. Please try loading it again.</p><button onClick={reset}>Try again</button></div></main>}
