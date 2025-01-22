/**
 * Represents a type of formatting (italic, bold, etc.) applied to a text.
 * @typedef {Object} Mark
 * @property {string} type - The type of the mark, such as 'italic', 'bold', 'strike', etc.
 */
interface Mark {
  type: string;
}

/**
 * Represents a content node in the JSON, which can contain text or other nodes.
 * @typedef {Object} ContentNode
 * @property {string} type - The type of the node (e.g., 'paragraph', 'orderedList', 'bulletList', etc.).
 * @property {string} [text] - The text inside the node, if applicable.
 * @property {Mark[]} [marks] - The marks applied to the text, such as bold or italic.
 * @property {ContentNode[]} [content] - Other content nodes, such as paragraphs or list items.
 */
interface ContentNode {
  type: string;
  text?: string;
  marks?: Mark[];
  content?: ContentNode[];
}

/**
 * Applies text marks (italic, bold, etc.) to a given text.
 *
 * @param {string} text - The text to which the marks will be applied.
 * @param {Mark[]} marks - The marks to apply to the text.
 * @returns {string} The text with the applied marks.
 */
const applyMarks = (text: string, marks: Mark[]): string => {
  marks.forEach((mark) => {
    switch (mark.type) {
      case 'italic':
        text = `_${text}_`;
        break;
      case 'bold':
        text = `*${text}*`;
        break;
      case 'strike':
        text = `~${text}~`;
        break;
      case 'code':
        text = `\`${text}\``;
        break;
    }
  });
  return text;
};

/**
 * Converts a text node into a WhatsApp-compatible message with applied marks.
 *
 * @param {any} textNode - The text node.
 * @returns {string} The text with applied marks.
 */
const convertTextNode = (textNode: any): string => {
  if (textNode.type === 'text') {
    let text = textNode.text || '';
    if (textNode.marks) {
      text = applyMarks(text, textNode.marks);
    }
    return text;
  }
  return '';
};

/**
 * Converts content in JSON format to a WhatsApp-compatible message.
 *
 * @param {ContentNode[]} jsonContent - The JSON content that represents the message.
 * @returns {string} The formatted message for WhatsApp.
 *
 * @example
 * const json = [
 *   {
 *     type: 'orderedList',
 *     content: [
 *       {
 *         type: 'listItem',
 *         content: [
 *           { type: 'paragraph', content: [{ type: 'text', text: 'Item 1 text' }] }
 *         ]
 *       },
 *       {
 *         type: 'listItem',
 *         content: [
 *           { type: 'paragraph', content: [{ type: 'text', text: 'Item 2 text' }] }
 *         ]
 *       }
 *     ]
 *   }
 * ];
 *
 * const message = jsonToMessageWhatsapp(json);
 * console.log(message); // "1. Item 1 text\n2. Item 2 text\n"
 */
export const jsonToMessageWhatsapp = (jsonContent: ContentNode[]): string => {
  let message = '';

  jsonContent.forEach((node) => {
    switch (node.type) {
      case 'paragraph':
        const paragraphContent = node.content?.map((textNode: any) => {
          if (textNode.type === 'text' || textNode.type === 'hardBreak') {
            return textNode.type === 'hardBreak' ? '\n' : convertTextNode(textNode);
          }
          return '';
        }).join('');

        if (paragraphContent && paragraphContent.trim()) {
          message += paragraphContent + '\n';
        } else {
          message += '\n';
        }
        break;

      case 'bulletList':
      case 'orderedList':
        const listItems = node.content?.map((listItem: any, index: number) => {
          const listItemContent = listItem.content?.map((itemNode: any) => {
            if (itemNode.type === 'paragraph') {
              return itemNode.content?.map((textNode: any) => convertTextNode(textNode)).join('');
            }
            return '';
          }).join('');

          return node.type === 'orderedList' ? `${index + 1}. ${listItemContent.trim()}` : `- ${listItemContent.trim()}`;
        }).join('\n');

        if (listItems && listItems.trim()) {
          message += listItems + '\n';
        }
        break;

      case 'blockquote':
        const blockquoteContent = node.content?.map((contentNode: any) => {
          if (contentNode.type === 'paragraph') {
            return contentNode.content?.map((textNode: any) => convertTextNode(textNode)).join('');
          }
          return '';
        }).join('');

        if (blockquoteContent && blockquoteContent.trim()) {
          message += `> ${blockquoteContent}\n`;
        }
        break;
    }
  });

  return message.trim();
};
