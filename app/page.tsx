'use client';

import { useState } from 'react';

// 検索結果のデータの型を定義
type SearchResult = {
  id: number;
  content: string;
  similarity: number;
};

export default function Home() {
  // 保存用の状態
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 検索用の状態（新しく追加！）
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- 保存機能 ---
  const handleSave = async () => {
    if (!input) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      if (!res.ok) throw new Error();
      setMessage('✅ 保存しました！');
      setInput('');
    } catch (error) {
      console.error(error);
      setMessage('❌ エラー');
    } finally {
      setLoading(false);
    }
  };

  // --- 検索機能（新しく追加！）---
  const handleSearch = async () => {
    if (!searchQuery) return;
    setSearchLoading(true);
    setSearchResults([]); // 前の結果をクリア

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error(error);
      alert('検索エラー');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-12 md:p-24 flex flex-col items-center gap-12 bg-gray-900 text-white">
      
      {/* 保存エリア */}
      <section className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-center">AIナレッジベース</h1>
        <textarea
          className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="知識を保存（例：Next.jsはReactのフレームワークです）"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSave}
          disabled={loading || !input}
          className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-bold disabled:bg-gray-600"
        >
          {loading ? '保存中...' : '知識を保存する'}
        </button>
        {message && <p className="text-center font-bold text-green-400">{message}</p>}
      </section>

      <hr className="w-full max-w-md border-gray-700" />

      {/* 検索エリア */}
      <section className="w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">AI検索</h2>
        <div className="flex gap-2">
            <input
                type="text"
                className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="何を探しますか？（例：Reactについて）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
                onClick={handleSearch}
                disabled={searchLoading || !searchQuery}
                className="bg-green-600 hover:bg-green-500 px-6 rounded-lg font-bold disabled:bg-gray-600"
            >
                {searchLoading ? '...' : '検索'}
            </button>
        </div>

        {/* 検索結果の表示 */}
        <div className="flex flex-col gap-3 mt-2">
            {searchResults.map((result) => (
                <div key={result.id} className="p-4 bg-gray-800 rounded-lg border border-gray-600 hover:bg-gray-750 transition">
                    <p className="text-gray-200">{result.content}</p>
                    <p className="text-xs text-gray-500 mt-2 text-right">
                        一致度: {(result.similarity * 100).toFixed(1)}%
                    </p>
                </div>
            ))}
            {/* 結果が0件だった場合 */}
            {searchResults.length === 0 && searchQuery && !searchLoading && (
               <p className="text-gray-500 text-center text-sm">（検索結果はありません）</p>
            )}
        </div>
      </section>
    </main>
  );
}