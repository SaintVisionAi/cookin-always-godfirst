'use client';

export default function StreamlitBridge() {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">📊 Deal Flow Metrics</h2>
      <iframe
        src="https://partnertech.streamlit.app"
        className="w-full h-[500px] rounded border border-gray-300 shadow"
      />
    </div>
  );
}
