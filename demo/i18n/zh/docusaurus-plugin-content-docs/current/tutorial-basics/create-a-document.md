---
sidebar_position: 2
---

# 创建一个文件

文件是通过连接的<strong>页面组</strong>。

*   一个<strong>侧边栏</strong>
*   <strong>上一个/下一个导航</strong>
*   <strong>版本管理</strong>

## 创建你的第一个文档

<code>在</code>マークダウンファイルを作成します。

```md title="docs/hello.md"
# Hello

This is my **first Docusaurus document**!
```

一份新的文件现在可以在<code>http://localhost:3000/docs/hello。</code>

## 配置侧边栏

Docusaurus自动从<code>docs</code>文件夹<strong>创建一个侧边栏</strong>。

添加元数据来定制侧边栏的标签和位置。

```md title="docs/hello.md" {1-4}
---
sidebar_label: "Hi!"
sidebar_position: 3
---

# Hello

This is my **first Docusaurus document**!
```

也可以在<code>sidebars.js</code>中明确地创建你的侧边栏。

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
