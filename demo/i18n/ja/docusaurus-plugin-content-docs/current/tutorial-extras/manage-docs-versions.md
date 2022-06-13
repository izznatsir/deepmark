---
sidebar_position: 1
---

# Docs のバージョンを管理する

ドキュソーでは、複数のバージョンのドキュメントを管理することができます。

## docs 版を作成する

プロジェクトのバージョン 1.0 をリリースしてください。

```bash
npm run docusaurus docs:version 1.0
```

<code>docs</code>フォルダが<code>versioned_docs/version-1.0</code>にコピーされ、<code>version.json</code>が作成されます。

あなたのドキュメントは、現在 2 つのバージョンに分かれています。

- <code>1.0 については</code>、<code>http://localhost:300</code>0/docs/、バージョン 1.0 のドキュメントをご覧ください。
- <code>Current</code>at<code>http://localhost:3000/docs/next/</code>for<strong>upcoming, unreleased docs</strong>

## バージョンのドロップダウンを追加する

バージョン間でシームレスにナビゲートするために、バージョンのドロップダウンを追加します。

<code>docusaurus.config.js</code>ファイルを修正します。

```js title="docusaurus.config.js"
module.exports = {
	themeConfig: {
		navbar: {
			items: [
				// highlight-start
				{
					type: 'docsVersionDropdown'
				}
				// highlight-end
			]
		}
	}
};
```

ナビバーに docs バージョンのドロップダウンが表示されます。

Docs バージョンドロップダウン]\(./img/docsVersionDropdown.png)

## 既存のバージョンを更新する

バージョン管理されたドキュメントは、それぞれのフォルダーで編集することが可能です。

- <code>versioned_docs/version-1.0/hello.md</code>updates<code>http://localhost:3000/docs/hello</code>
- <code>docs/hello.md</code>の更新<code>http://localhost:3000/docs/next/hello</code>
