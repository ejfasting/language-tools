# SuperOffice Language Tools

This repository contains all the editor tooling required for working with Javascript for SuperOffice (`.jsfso` files) and CRMScript (`.crmscript` files) .

It contains an implementation of the [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/) and is currently under development.

## Packages

This repository is a monorepo managed through [pnpm](https://pnpm.io/), which means that all packages share a node_modules on root.

### [`@superoffice/language-server`](packages/language-server)

The SuperOffice language server, powered by [Volar](https://volarjs.dev/).

#### Features

- [x] Code completion
- [x] Diagnostics
- [ ] Hover
- [ ] Includes
- [ ] Syntax highlighting
- [ ] Semantic tokens

### [`@superoffice/langium-crmscript`](packages/langium-crmscript)

The language definition framework for crmscript.

### [`@superoffice/vscode`](packages/vscode)

This module acts as a Language Server Protocol (LSP) language client. Its primary responsibility is to communicate with the [`@superoffice/language-server`](packages/language-server) module (acting as an LSP server) and integrate the language services provided by the server into the VS Code editor. This architecture allows for the reuse of language services across different editors and IDEs, with the implementation of the corresponding LSP client. In this case, @volar/vscode is the LSP client implementation for VS Code.

### [`@superoffice/monaco`](packages/monaco)

Implementation for the Monaco Editor using the [`@superoffice/language-server`](packages/language-server)

## Getting Started

- pnpm i
- Run&debug -> Launch client

### Additional scripts

#### pnpm run build:langium

Creates the .tmLanguage.json and generated-folder, used for the crmscript language.

#### pnpm run monaco

Launches the monaco editor which can be opened locally.