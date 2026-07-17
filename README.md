# Y.W.C.関東case セットアップ手順（すべてブラウザだけでOK）

パソコンに何もインストールしなくても、この手順どおりに進めれば公開できます。

---

## STEP 1. Supabaseにテーブルを作る

1. https://supabase.com/dashboard であなたのプロジェクトを開く
2. 左メニューの **SQL Editor** をクリック
3. 「New query」→ このプロジェクトの `supabase/schema.sql` の中身を全部コピーして貼り付け
4. 右下の **Run** をクリック（テーブル・権限設定が一括で作られます）

## STEP 2. 管理者アカウントを作る

1. 左メニューの **Authentication** → **Users** → **Add user** をクリック
2. メールアドレスとパスワードを設定して作成（例：admin@ywc-kanto.jp）
3. 作成されたユーザーの一覧に表示される **UID**（英数字の長い文字列）をコピー
4. 左メニューの **Table Editor** → `users_profile` テーブルを開く → **Insert row**
   - `id`：さきほどコピーしたUID
   - `name`：管理者の名前
   - `role`：`admin`
   - `client_id`：空欄のまま
5. 保存すれば、そのメールアドレス・パスワードで管理者としてログインできるようになります

**取引先アカウントも作りたい場合**は同じ手順で、`role` を `client`、`client_id` に該当する取引先の行のID（`clients`テーブルから確認）を設定してください。

## STEP 3. コードをGitHubにアップロードする

1. https://github.com で **New repository** をクリック（Repository name：`ywc-kanto-case`、Public/Privateどちらでも可）
2. 作成後の画面で「uploading an existing file」というリンクをクリック
3. ダウンロードしたプロジェクトフォルダの中身を、まるごとドラッグ＆ドロップ
   - `node_modules` フォルダは無い状態のはずなので、そのまま全部アップロードして大丈夫です
4. 一番下の **Commit changes** をクリック

## STEP 4. Cloudflare Pagesと連携する

1. https://dash.cloudflare.com → 左メニュー **Workers & Pages** → **Create** → **Pages** タブ → **Connect to Git**
2. さきほどの `ywc-kanto-case` リポジトリを選択
3. ビルド設定は以下のとおり入力
   - Framework preset：`Next.js (Static HTML Export)`
   - Build command：`npm run build`
   - Build output directory：`out`
4. **Environment variables** に以下の2つを追加（値はSupabaseの Project Settings > API から）
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Save and Deploy** をクリック

数分待つと、`https://ywc-kanto-case.pages.dev` のようなURLが発行され、そこからアプリにアクセスできます。

## 更新のしかた

以降は、コードを直したい時にGitHubのリポジトリのファイルを編集・再アップロードするだけで、Cloudflareが自動で再ビルド・再公開してくれます（毎回STEP 4をやり直す必要はありません）。

## 困ったときは

- ログインできない → STEP 2の `users_profile` の登録が正しいか確認してください
- 取引先なのに他社の案件が見える／見えない → `client_id` が `clients` テーブルの正しい行と一致しているか確認してください
- 画面が真っ白になる → Cloudflare Pagesの環境変数（STEP 4-4）が正しく設定されているか確認してください
   
