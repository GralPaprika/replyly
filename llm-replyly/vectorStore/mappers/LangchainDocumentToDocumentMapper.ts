import {DocumentInterface} from "@langchain/core/documents";
import {Document} from "../../../lib/ai/models/Document";

export class LangchainDocumentToDocumentMapper {
  map({pageContent, id, metadata}: DocumentInterface): Document {
    return {
      pageContent,
      metadata,
      id,
    };
  }
}