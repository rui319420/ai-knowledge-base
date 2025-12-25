import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { generateEmbedding } from '@/utils/gemini';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json(); // 検索キーワードを受け取る

    if (!query) {
      return NextResponse.json({ error: '検索ワードが空です' }, { status: 400 });
    }

    // 1. 検索ワードをAIでベクトル化する
    const embedding = await generateEmbedding(query);

    // 2. Supabaseの関数（match_documents）を使って似ている記事を探す
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding, // 検索クエリのベクトル
      match_threshold: 0.5,       // 類似度のしきい値（0.5以上の一致）
      match_count: 5              // 上位5件まで取得
    });

    if (error) {
      throw error;
    }

    // 3. 結果を画面に返す
    return NextResponse.json({ results: data });

  } catch (error) {
    console.error('検索エラー:', error);
    return NextResponse.json({ error: '検索に失敗しました' }, { status: 500 });
  }
}