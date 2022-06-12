---
sidebar_position: 2
---

# ドキュメントを作成する

ドキュメントは、<strong>ページがつながっているグループ</strong>です。

*   <strong>サイドバー</strong>
*   <strong>前/次のナビゲーション</strong>
*   <strong>バージョニング</strong>

## 最初のDocを作成する

<code>docs/hello.mdに</code>マークダウンファイルを作成します。

```md title="docs/hello.md"
# Hello

This is my **first Docusaurus document**!
```

新しいドキュメントが<code>http://localhost:3000/docs/hello</code> に掲載されました。

## サイドバーの設定

ドキュソーが自動的に<code>ドキュメントフォルダから</code> <strong>サイドバーを</strong>作成します。

メタデータを追加して、サイドバーのラベルや位置をカスタマイズすることができます。

```md title="docs/hello.md" {1-4}
---
sidebar_label: "Hi!"
sidebar_position: 3
---

# Hello

This is my **first Docusaurus document**!
```

また、<code>sidebars.jsで</code>明示的にサイドバーを作成することも可能です。

```js title="sidebars.js"
module.exports = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Tutorial",
      // highlight-next-line
      items: ["hello"],
    },
  ],
};
```
