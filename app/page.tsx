'use client'; // これは「画面で動くプログラム」という宣言です

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 保存ボタンを押したときの処理
  const handleSave = async () => {
    if (!input) return;
    setLoading(true);
    setMessage('');

    try {
      // さっき作ったAPI (app/api/documents/route.ts) にデータを送る
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) throw new Error('保存に失敗しました');

      setMessage('✅ 保存しました！');
      setInput(''); // 入力欄を空にする
    } catch (error) {
      console.error(error);
      setMessage('❌ エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-24 flex flex-col items-center gap-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">AIナレッジベース</h1>
      
      <div className="w-full max-w-md flex flex-col gap-4">
        <textarea
          className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="保存したい知識やメモを入力してください..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSave}
          disabled={loading || !input}
          className={`p-3 rounded-lg font-bold transition-colors ${
            loading || !input
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {loading ? 'AIが処理中...' : '保存する'}
        </button>

        {message && <p className="text-center font-bold">{message}</p>}
      </div>
    </main>
  );
}