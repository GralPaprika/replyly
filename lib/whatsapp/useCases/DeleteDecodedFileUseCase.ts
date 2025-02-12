import * as fs from 'fs';

export class DeleteDecodedFileUseCase {
  execute(filename: string) {
    fs.unlink(filename, err => {
      if (err) {
        console.error(err);
      }
    })
  }
}