import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  encodeBase64(plain: string): string {
    return new Buffer(plain).toString('base64');
  }

  decodeBase64(encoded: string): string {
    return new Buffer(encoded, 'base64').toString('ascii');
  }

  jsonStringify(data: any): string {
    return JSON.stringify(data);
  }

  jsonParse(jsondata: string): any {
    return JSON.parse(jsondata);
  }

  stringifyAndEncodeBase64(data: any) {
    return this.encodeBase64(this.jsonStringify(data));
  }

  decodeBase64AndParse(encoded: string) {
    return this.jsonParse(this.decodeBase64(encoded));
  }
}
