---
sidebar_position: 1
---

# ページを作成する

<code>src/pagesに</code> <strong>MarkdownやReactの</strong>ファイルを追加して、<strong>独立したページを</strong>作成します。

*   <code>src/pages/index.js</code>-><code>localhost:3000/。</code>

*   <code>src/pages/foo.md</code>-><code>localhost:3000/foo</code>

*   <code>src/pages/foo/bar.js</code>-><code>localhost:3000/foo/bar</code>

## 最初の React ページを作成する

<code>src/pages/my-react-page.js</code> にファイルを作成します。

```jsx title="src/pages/my-react-page.js"
import React from 'react';
import Layout from '@theme/Layout';

export default function MyReactPage() {
	return (
		<Layout>
			<h1>My React page</h1>
			<p>This is a React page</p>
		</Layout>
	);
}
```

新しいページができました<code>（http://localhost:300</code>0/my-react-page）。

## 最初のMarkdownページを作成する

<code>src/pages/my-markdown-page.md</code> にファイルを作成します。

```mdx title="src/pages/my-markdown-page.md"
# My Markdown page

This is a Markdown page
```

新しいページができました<code>（http://localhost:300</code>0/my-markdown-page）。
