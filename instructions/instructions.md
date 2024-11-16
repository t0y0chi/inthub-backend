# Gmail Chat RAG Application PRD

## 1. 製品概要

### 1.1 コアバリュー
- Gmailの内容について自然言語で質問し、AIが回答
- メールの文脈を理解した上での回答

### 1.2 ユースケース例
```typescript
type ExampleQueries = {
  queries: [
    "先月のプロジェクトXの見積もり金額はいくらでしたか？",
    "田中さんとの最後のやり取りの内容を要約して",
    "今年の福岡出張の日程を教えて",
    "契約更新の期限はいつですか？",
  ]
}
```

## 2. 技術スタック

- TypeScript
- tRPC
- Tailwind CSS
- shadcn/ui
- Next.js 14 (App Router)
- Gmail API
- Supabase (PostgreSQL + pgvector)
- OpenAI API (GPT-4 + Embeddings)

## 3. 機能

- Google OAuth認証
- メール同期設定
  - 日付範囲指定
- 同期状態の表示
- チャットインターフェース
  - メッセージ入力
  - AIレスポンス
  - 参照メールへのリンク
- 会話履歴
