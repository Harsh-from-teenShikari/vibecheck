import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ControlPlaneService } from './control-plane.service';
import { ControlPlaneController } from './control-plane.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ControlPlaneController],
  providers: [ControlPlaneService],
  exports: [ControlPlaneService]
})
export class ControlPlaneModule { }
