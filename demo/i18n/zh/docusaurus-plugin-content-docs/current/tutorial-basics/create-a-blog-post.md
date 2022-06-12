---
sidebar_position: 3
---

# 创建一篇博客文章

Docusaurus<strong>为每篇博客文章</strong>创建一个<strong>页面</strong>，同时也是一个<strong>博客索引页面</strong>，一个<strong>标签系统</strong>，一个<strong>RSS订阅</strong>...

\##创建你的第一个帖子

<code>在</code>ファイルを作成します。

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

一篇新的博文现在可以在<code>http://localhost:3000/blog/greetings。</code>
