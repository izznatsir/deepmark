---
sidebar_position: 1
---

# 管理文件版本

Docusaurus 可以管理你的文档的多个版本。

\##创建一个文档版本

发布你的项目的 1.0 版本。

```bash
npm run docusaurus docs:version 1.0
```

<code>docs</code>フォルダが<code>versioned_docs/version-1.0</code>にコピーされ、<code>version.json</code>が作成されます。

你的文件现在有两个版本。

- <code>1.0</code>版本的文档在<code>http://localhost:3000/docs/</code>。
- <code>目前</code>在<code>http://localhost:3000/docs/next/</code>，为<strong>即将到来的、未发布的文件</strong>。

\##添加一个版本下拉菜单

为了在不同的版本之间进行无缝导航，添加一个版本下拉菜单。

<code>修改</code>ファイルを修正します。

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

文档版本下拉菜单出现在你的导航栏中。

![文件版本下拉](./img/docsVersionDropdown.png)

\##更新现有版本

可以在各自的文件夹中编辑版本的文档。

- <code>versioned/\_docs/version-1.0/hello.md</code>更新<code>http://localhost:3000/docs/hello</code>
- <code>docs/hello.md</code>更新<code>http://localhost:3000/docs/next/hello</code>
