---
sidebar_position: 2
---

# あなたのサイトを翻訳する

<code>docs/intro.md を</code>フランス語に翻訳してみましょう。

## i18n の設定

<code>docusaurus.config.js</code>を修正し、<code>fr</code>ロケールのサポートを追加しました。

```js title="docusaurus.config.js"
module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'fr']
	}
};
```

## Translate a doc

<code>docs/intro.md</code>ファイルを<code>i18n/fr</code>フォルダにコピーします。

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-docs/current/

cp docs/intro.md i18n/fr/docusaurus-plugin-content-docs/current/intro.md
```

<code>i18n/fr/docusaurus-plugin-content-docs/current/intro.md</code>をフランス語に翻訳しました。

## ローカライズサイトの立ち上げ

フランス語のロケールでサイトを開始します。

```bash
npm run start -- --locale fr
```

ローカライズされたサイトは、<code>http://localhost:300</code>0/fr/、<code>Getting Started</code>ページが翻訳され、アクセス可能です。

:::注意

開発では、同時に使用できるロケールは 1 つだけです。

:::

## ロケールドロップダウンを追加する

言語間でシームレスにナビゲートするために、ロケールのドロップダウンを追加します。

<code>docusaurus.config.js</code>ファイルを修正します。

```js title="docusaurus.config.js"
module.exports = {
	themeConfig: {
		navbar: {
			items: [
				// highlight-start
				{
					type: 'localeDropdown'
				}
				// highlight-end
			]
		}
	}
};
```

ロケールのドロップダウンがナビバーに表示されるようになりました。

ロケールドロップダウン]\(./img/localeDropdown.png)

## ローカライズされたサイトを構築する

特定のロケール向けにサイトを構築する。

```bash
npm run build -- --locale fr
```

または、すべてのロケールを一度に含むようにサイトを構築します。

```bash
npm run build
```
