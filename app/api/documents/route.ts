import { NextRequest, NextResponse } from 'next/server';
// 前の手順で作った道具箱から機能をインポートします
// エラーが出る場合はパスを '../utils/...' などに書き換えてみてください
import { supabase } from '@/utils/supabase';
import { generateEmbedding } from '@/utils/gemini';

export async function POST(req: NextRequest) {
  try {
    // 1. 画面から送られてきたデータ（文章）を受け取る
    const { text } = await req.json();

    if (!text) {
        return NextResponse.json({ error: '文章が空です' }, { status: 400 });
    }

    // 2. Geminiを使って文章をベクトル（数値）に変換する
    // ※ここがAIの肝です！
    const embedding = await generateEmbedding(text);

    // 3. Supabase（データベース）に保存する
    const { data, error } = await supabase
      .from('documents') // documentsテーブルに
      .insert({
        content: text,       // 元の文章と
        embedding: embedding // ベクトルデータのセットを保存
      })
      .select();

    if (error) {
      throw error;
    }

    // 4. 成功したら結果を返す
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('保存エラー:', error);
    return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 });
  }
}