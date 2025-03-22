import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { Request } from 'express';
import * as request from 'supertest';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  // private readonly logger = new ContextLogger(LocalGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // ContextLogger.updateContext(context);
    return super.canActivate(context);
  }
}
