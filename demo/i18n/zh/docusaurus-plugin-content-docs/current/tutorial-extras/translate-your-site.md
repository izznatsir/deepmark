---
sidebar_position: 2
---

# 翻译你的网站

<code>让我们把</code>フランス語に翻訳してみましょう。

## 配置 i18n

<code>修改</code>を修正し、<code>fr</code>ロケールのサポートを追加しました。

```js title="docusaurus.config.js"
module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'fr']
	}
};
```

## 翻译一个文档

<code>将</code>ファイルを<code>i18n/fr</code>フォルダにコピーします。

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-docs/current/

cp docs/intro.md i18n/fr/docusaurus-plugin-content-docs/current/intro.md
```

<code>将</code>をフランス語に翻訳しました。

\##开始你的本地化网站

在法国当地开始你的网站。

```bash
npm run start -- --locale fr
```

你的本地化网站可在<code>http://localhost:3000/fr/</code>，<code>入门</code>页面也已翻译完毕。

::谨慎

在开发中，你在同一时间只能使用一个地区性的语言。

:::

\##添加一个地域下拉菜单

为了实现跨语言的无缝导航，请添加一个地区语言下拉菜单。

<code>修改</code>ファイルを修正します。

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

本地化的下拉菜单现在出现在你的导航栏中。

![Locale Dropdown](./img/localeDropdown.png)

\##建立你的本地化网站

为一个特定的地区建立你的网站。

```bash
npm run build -- --locale fr
```

或者建立你的网站，一次性包括所有的地区。

```bash
npm run build
```
