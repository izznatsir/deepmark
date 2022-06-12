---
sidebar_position: 3
---

# ブログ記事を作成する

Docusaurusは、<strong>ブログの各記事のページを</strong>作成するだけでなく、<strong>ブログのインデックスページ</strong>、<strong>タグシステム</strong>、<strong>RSS</strong>フィード...を作成します。

## 最初の投稿を作成する

<code>blog/2021-02-28-greetings.mdに</code>ファイルを作成します。

```md title="blog/2021-02-28-greetings.md"
---
slug: greetings
title: Greetings!
authors:
  - name: Joel Marcey
    title: Co-creator of Docusaurus 1
    url: https://github.com/JoelMarcey
    image_url: https://github.com/JoelMarcey.png
  - name: Sébastien Lorber
    title: Docusaurus maintainer
    url: https://sebastienlorber.com
    image_url: https://github.com/slorber.png
tags: [greetings]
---

Congratulations, you have made your first post!

Feel free to play around and edit this post as much you like.
```

新しいブログ記事<code>（http://localhost:300</code>0/blog/greetings）が公開されました。
