import {Exception} from "@/lib/common/models/Exception";

export class RepositoryException implements Exception {
  constructor(readonly message: string) {}
}