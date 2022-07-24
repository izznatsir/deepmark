---
sidebar_position: 1
---

# 创建一个页面

<code>将</code> <strong>MarkdownやReactの</strong>ファイルを追加して、<strong>独立したページを</strong>作成します。

*   <code>src/pages/index.js</code>-><code>localhost:3000/</code>

*   <code>src/pages/foo.md</code>-><code>localhost:3000/foo</code>

*   <code>src/pages/foo/bar.js</code>-><code>localhost:3000/foo/bar</code>

\##创建你的第一个React页面

<code>在</code> にファイルを作成します。

```jsx title="src/pages/my-react-page.js"
import React from "react";
import Layout from "@theme/Layout";

export default function MyReactPage() {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  );
}
```

现在有一个新的页面，<code>http://localhost:3000/my-react-page。</code>

## 创建你的第一个Markdown页面

<code>在</code> にファイルを作成します。

```mdx title="src/pages/my-markdown-page.md"
# My Markdown page

This is a Markdown page
```

现在有一个新的页面，<code>http://localhost:3000/my-markdown-page。</code>
