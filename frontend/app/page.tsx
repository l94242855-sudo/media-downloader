"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaInfo, setMediaInfo] = useState<any>(null);
  const [error, setError] = useState("");

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setMediaInfo(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-cloud-run-url.a.run.app";

      const response = await fetch(`${backendUrl}/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to extract media");

      setMediaInfo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <div className="w-full max-w-xl p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-2">Media Downloader</h1>
        <p className="text-gray-400 text-center mb-6">Paste a video link to extract and download</p>

        <form onSubmit={handleExtract} className="space-y-4">
          <input
            type="url"
            placeholder="Paste video URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Extract Media"}
          </button>
        </form>

        {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">{error}</div>}

        {mediaInfo && (
          <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-700 space-y-4">
            {mediaInfo.thumbnail && (
              <img src={mediaInfo.thumbnail} alt="Thumbnail" className="w-full h-48 object-cover rounded-lg" />
            )}
            <h2 className="font-semibold text-lg line-clamp-2">{mediaInfo.title}</h2>
            <a
              href={mediaInfo.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition duration-200"
            >
              Download File
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
