# TODO 管理ウェブサイト

Nuxt3 と Pinia を使用して実装した **TODO 管理 Web アプリケーション** です。

---

## 📋 主な機能

### 1. メインページ

- **「Todo List App」** のタイトルを表示
- 最近の活動履歴をリスト形式で表示
- 活動項目をクリックすると該当する TODO に移動

### 2. TODO ページ

- **TODO 追加、検索、削除** 機能を提供
- 検索履歴の保存と削除が可能
- TODO の **編集** および **完了状態（チェック）** の切り替えが可能
- 特定の TODO を **ハイライト表示** し、画面中央にスクロール

### 3. Pinia 状態管理

- TODO リストと最近の活動履歴を **クッキー** に保存・管理
- 最近の活動履歴は **最大 10 件** まで保持

---

## 🚀 実行方法

### 1. リポジトリをクローン

お使いの IDE でプロジェクトをクローンしてください:

```bash
git clone https://github.com/mildmint1/Nuxt3---TodoApp.git
```

### 2. プロジェクトのインストール

以下のコマンドで依存関係をインストールします:

```bash
npm install
```

以下のコマンドで 開発サーバー を起動し、プロジェクトを実行します:

```bash
npm run dev
```

## 🛠️ 技術スタック

- **フレームワーク**: Nuxt3
- **言語**: TypeScript
- **状態管理**: Pinia
- **クッキー管理**: js-cookie
- **UI スタイル**: Tailwind CSS

---

## 📂 プロジェクト構成

```plaintext
.
├── components/          # 再利用可能なコンポーネント
│   ├── SearchHistory.vue  # 検索履歴表示コンポーネント
│   ├── TodoForm.vue       # TODO追加・検索フォーム
│   ├── TodoItem.vue       # 単一のTODOアイテム
│   └── TodoList.vue       # TODOリストコンポーネント
│
├── pages/               # ページルーティング
│   ├── index.vue        # メインページ
│   └── todo.vue         # TODO管理ページ
│
├── stores/              # Pinia状態管理
│   ├── activityStore.ts # 最近の活動履歴管理
│   └── todoStore.ts     # TODO関連の状態管理
│
├── types/               # 型定義ファイル
│   └── todo.ts          # TODOデータ型
```
