import { Injectable } from '@angular/core';
import type { User } from '@demo/platform-sdk';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  getCurrentUser(): User {
    return { id: '123', name: 'George' };
  }
}
