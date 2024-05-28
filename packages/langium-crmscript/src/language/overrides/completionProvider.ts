import { AstNode, AstNodeDescription } from 'langium';
import { CompletionContext, CompletionValueItem, DefaultCompletionProvider } from 'langium/lsp';

import {
  CompletionItem,
  MarkupKind,
  MarkupContent
} from 'vscode-languageserver';
import { TypeDescription } from '../type-system/descriptions.js';
import { inferType } from '../type-system/infer.js';
import { NilExpression } from '../generated/ast.js';

// Define the documentation object
const dataTypeDocs: { [key: string]: { description: string, example: string } } = {
  string: {
    description: `A text string is a sequence of characters written with quotes.
You can use single or double quotes, but they must always come in pairs. Quotes can also be nested, by alternating between single and double quotes.`,
    example: `String myCompany = "SuperOffice";
String myLocation = 'Oslo';
String onion = "The 'onion' has many layers.";`
  },
  integer: {
    description: `An integer is a whole number without any decimal points. It can be positive or negative.`,
    example: `Integer a = 5;
Integer b = -3;
Integer c = a + b;`
  }
  // Add other data types as needed
};

// Function to add a new data type
function addDataType(
  type: string,
  description: string,
  example: string
) {
  dataTypeDocs[type] = { description, example };
}

//Example of adding more data types
addDataType(
  'Bool',
  `A boolean represents a logical value that can be either true or false.`,
  `Boolean isActive = true;
Boolean isDone = false;`
);


export class CustomCompletionProvider extends DefaultCompletionProvider {

  protected createReferenceCompletionItem(nodeDescription: AstNodeDescription): CompletionValueItem {
    return {
      nodeDescription,
      kind: this.nodeKindProvider.getCompletionItemKind(nodeDescription),
      detail: nodeDescription.type,
      sortText: '0',
      documentation: createMarkdown(nodeDescription)
    };
  }
  // protected fillCompletionItem(context: CompletionContext, item: CompletionValueItem): CompletionItem | undefined {
  //   let label: string;
  //   console.log(item.detail);
  //   if (typeof item.label === 'string') {
  //     label = item.label;
  //   } else if ('node' in item) {
  //     const name = this.nameProvider.getName(item.node);
  //     if (!name) {
  //       return undefined;
  //     }
  //     label = name;
  //   } else if ('nodeDescription' in item) {
  //     label = item.nodeDescription.name;
  //   } else {
  //     return undefined;
  //   }
  //   let insertText: string;
  //   if (typeof item.textEdit?.newText === 'string') {
  //     insertText = item.textEdit.newText;
  //   } else if (typeof item.insertText === 'string') {
  //     insertText = item.insertText;
  //   } else {
  //     insertText = label;
  //   }
  //   const textEdit = item.textEdit ?? this.buildCompletionTextEdit(context, label, insertText);
  //   if (!textEdit) {
  //     return undefined;
  //   }

  //   // Copy all valid properties of `CompletionItem`
  //   const completionItem: CompletionItem = {
  //     additionalTextEdits: item.additionalTextEdits,
  //     command: item.command,
  //     commitCharacters: item.commitCharacters,
  //     data: item.data,
  //     detail: item.detail,
  //     documentation: this.getDocumentation(item.label),
  //     filterText: item.filterText,
  //     insertText: item.insertText,
  //     insertTextFormat: item.insertTextFormat,
  //     insertTextMode: item.insertTextMode,
  //     kind: item.kind,
  //     labelDetails: item.labelDetails,
  //     preselect: item.preselect,
  //     sortText: item.sortText,
  //     tags: item.tags,
  //     textEditText: item.textEditText,
  //     textEdit,
  //     label
  //   };
  //   return completionItem;
  // }

//   protected getReferenceDocumentation(nodeDescription: AstNodeDescription): MarkupContent | string | undefined {
//     if (!nodeDescription.node) {
//         return undefined;
//     }
//     const documentationText = documentationProvider.getDocumentation(nodeDescription.node);
//     if (!documentationText) {
//         return undefined;
//     }
//     return { kind: 'markdown', value: documentationText };
// }

  // getDocumentation(label: string | undefined) {
  //   console.log(label);
  //   if(!label) return 'Undefined';
  //   const doc = dataTypeDocs[label];
  //   if (doc) {
  //     return {
  //       kind: MarkupKind.Markdown,
  //       value: [
  //         `# ${label}`,
  //         '',
  //         `${doc}`,
  //         '',
  //         '```crmscript',
  //         '',
  //         `${doc.example}`,
  //         '',
  //         '```',
  //         '',
  //       ].join('\n')
  //     };
  //     //return doc.description;
  //   }
  //   else {
  //     return undefined;
  //   }
  // }
}

function createMarkdown(nodeDescription: AstNodeDescription): MarkupContent | undefined {
  const customType = inferType(nodeDescription.node, getTypeCache());
  const label = customType.$type;
  if (Object.prototype.hasOwnProperty.call(dataTypeDocs, label)) {
    const doc = dataTypeDocs[label];
    return {
      kind: MarkupKind.Markdown,
      value: [
        `# ${label}`,
        '',
        `${doc}`,
        '',
        '```crmscript',
        '',
        `${doc.example}`,
        '',
        '```',
        '',
      ].join('\n')
    };
  } else {
    // Handle the case where the item.label is not in dataTypeDocs
    console.log(`Documentation for ${label} not found.`);
    return undefined;
  }
}

function getTypeCache(): Map<AstNode, TypeDescription> {
  return new Map();
}