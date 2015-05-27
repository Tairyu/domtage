## 特徴

#### Template is Pure HTML files

Domtage のテンプレートファイルは通常の HTML ファイルをそのまま利用できます。  


#### Use CSS-Selector in template manipulation

テンプレートファイルの書き換えは DOM 要素を CSS セレクタで指定することで実現します。  
jQuery や CSS を作成する時と同じ感覚でテンプレートファイルを編集することができます。 

全ての操作を設定ファイル上に定義するため、テンプレートファイル内に独自のタグやコードを書き込む必要はありません。
 

#### Recursive generate

Domtage で生成した HTML ファイル自体もテンプレートとして更に派生的な生成を設定することもできます。  
１つの生成結果から大量の派生パターンを生成することも簡単に実現できます。  

#### Flexible  

Domtage はテンプレートファイルを一切区別しません。  
どんなテンプレートファイルも出力結果の雛形としても、差し替え用としても設定できます。  
  
特定のディレクトリ構成を強要したりもしません。  
テンプレートファイルはオプションで指定した読み込み元ディレクトリの中であればどのようなディレクトリ構成で分けるのも自由です。 
 
## オプション

ビルド全体に適用されるオプション項目です。  
以下の項目を任意に設定できます。  

### srcDir  

Type: `String`  
Default: `src/`

テンプレートファイルのルートディレクトリを設定します。  
domtage はテンプレートファイルをここで指定されたディレクトリの中から参照します。  

### destDir  

Type: `String`  
Default: `dest/`  

HTMLファイルの出力先ルートディレクトリを設定します。

### encode  

Type: `String`
Default: `utf-8`  

ファイルエンコードを指定します。  

### ext  

Type: `String`  
Default: `.html`  

テンプレートファイルの拡張子を設定します。  
`.html`以外の拡張子のファイルを使用する場合はここを変更してください。  

## 設定ファイル

設定ファイルは以下のフォーマットで記述します。

- **name**
  ビルドするHTMLファイル名を設定します。  
  また雛形となるテンプレートファイルもこの値と同じファイルになります。

- **layouts**
  雛形から差し替えるDOM要素と差し替えるテンプレートファイルを設定します。  
  設定項目は以下のように`<CSSセレクタ>:<テンプレートファイル>`の形式で列挙します。  
  
  ```yaml
  - name: index
    layouts:
      header: header/default
      "#content": index/content
      .side-panel: index/side-panel
  ```
  
  CSSセレクタにマッチしたDOM要素は全て対応するテンプレートファイルの内容に置き換えられます。  
  また、 **YAMLファイルは#を文字列として扱うため、idセレクタを使用する場合は必ず""でくくる必要があることに注意してください。**  
  
- **patterns**  
  ビルドされたHTMLファイルを雛形として更に別なHTMLファイルを生成する場合、ここにそのビルド内容を列挙します。  
  設定内容も全く同じように`name`,`layouts`,`patterns`を記述するだけです。  

  以下はビルドされたindexファイルを雛形としてindex2,index2-no-replaceの２つのファイルを生成する設定例です。  
  
  ```yaml
  - name: index
    layouts:
      header: header/default
      footer: footer/default
      "#content": index/content
      .side-panel: index/side-panel
    patterns:
      - name: index2
        layouts:
          .sign-in: header/sign-up
      - name: index2-no-replace  
  ```  
    
  **patterns** は必要に応じて再帰的に設定可能です。