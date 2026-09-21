import { Module } from '@nestjs/common';
import { JumpsellerClient } from './jumpseller.client.js';

@Module({
  providers: [JumpsellerClient],
  exports: [JumpsellerClient],
})
export class JumpsellerModule {}