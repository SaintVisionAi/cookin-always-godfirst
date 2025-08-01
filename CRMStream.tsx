'use client';

export default function CRMStream() {
  return (
    <div className="border rounded-lg overflow-hidden mt-8">
      <iframe
        src="https://saintsal-partnertech.streamlit.app/?embed=true"
        width="100%"
        height="600"
        frameBorder="0"
        className="w-full"
      />
    </div>
  );
}
