---
sidebar_position: 5
---

# サイトをデプロイする

Docusaurus は、<strong>静的サイトジェネレータ</strong>（<strong><a href="https://jamstack.org/">Jamstack とも</a></strong>呼ばれる）です。

シンプルな<strong>静的 HTML、JavaScript、CSS ファイルとして</strong>サイトを構築します。

## サイトを構築する

<strong>本番</strong>用のサイトを構築する。

```bash
npm run build
```

静的ファイルは、<code>build</code>フォルダに生成されます。

## サイトをデプロイする

本番ビルドをローカルでテストしてください。

```bash
npm run serve
```

<code>ビルドフォルダは</code>、<code>http://localhost:3000/</code> で提供されるようになりました。

<code>ビルドフォルダを</code> <strong>ほとんどどこにでも</strong>簡単に、<strong>無料</strong>またはわずかな費用で配備できるようになりました（<strong><a href="https://docusaurus.io/docs/deployment">配備ガイドを</a></strong>お読みください）。
