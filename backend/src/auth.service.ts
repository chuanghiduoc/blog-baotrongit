import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getTest(): string {
    return 'Test';
  }
  getId(): string {
    return 'getId';
  }
  postGetId(): string {
    return 'getId';
  }
}
