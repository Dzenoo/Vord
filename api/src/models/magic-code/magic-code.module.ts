import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MagicCode, MagicCodeSchema } from './schema/magic-code.schema';
import { MagicCodeService } from './magic-code.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MagicCode.name, schema: MagicCodeSchema },
    ]),
  ],
  providers: [MagicCodeService],
  exports: [MagicCodeService],
})
export class MagicCodeModule {}
