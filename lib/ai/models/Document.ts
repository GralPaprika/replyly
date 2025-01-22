export interface Document<Metadata extends Record<string, any> = Record<string, any>> {
  pageContent: string;
  metadata: Metadata;
  id?: string;
}