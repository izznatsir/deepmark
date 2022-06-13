---
sidebar_position: 1
---

# チュートリアルの紹介

<strong>5 分以内にドキュサウルスを</strong>発見しよう。

## Getting Started

まずは<strong>新規にサイトを</strong>作成することから始めましょう。

また、<strong><a href="https://docusaurus.new">docusaurus.new</a></strong> で<strong>すぐに Docusaurus を</strong>お試しください。

### 必要なもの

- <a href="https://nodejs.org/en/download/">Node.js の</a>バージョン 14 以上。
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

## 新しいサイトを生成する

<strong>古典的なテンプレートを</strong>使用して新しいドキュソーサイトを生成します。

コマンドを実行すると、クラシックテンプレートが自動的にプロジェクトに追加されます。

```bash
npm init docusaurus@latest my-website classic
```

このコマンドは、コマンドプロンプト、Powershell、ターミナル、その他コードエディターの統合ターミナルに入力することができます。

また、このコマンドは Docusaurus を実行するために必要なすべての依存関係をインストールします。

## Start your site

開発用サーバーを起動します。

```bash
cd my-website
npm run start
```

<code>cd</code>コマンドは、作業しているディレクトリを変更します。新しく作成した Docusaurus サイトで作業するために、ターミナルをそこに移動する必要があります。

<code>npm run start</code>コマンドは、ローカルにウェブサイトを構築し、開発用サーバーを通じて提供し、http://localhost:3000/、閲覧できるようにします。

<code>docs/intro.md</code>(このページ) を開き、いくつかの行を編集してください。サイトは<strong>自動的にリロード</strong>され、あなたの変更が表示されます。
