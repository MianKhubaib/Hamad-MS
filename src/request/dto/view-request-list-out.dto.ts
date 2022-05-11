import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ViewRequestListOutDto {
  @ApiProperty({ description: 'request id' })
  @Expose({ name: 'RowKey' })
  id: string;

  @ApiProperty({ description: 'request id' })
  @Expose()
  @Transform(({ obj }) => `Req-${obj.RowKey}`)
  display_id: string;

  @ApiProperty({ description: 'request date' })
  @Expose()
  requested_time: Date;

  @ApiProperty({ description: 'request title' })
  @Expose()
  title: string;

  @ApiProperty({ description: 'request purpose' })
  @Expose()
  purpose: string;

  @ApiProperty({ description: 'request required/expected date' })
  @Expose()
  required_by: Date;

  @ApiProperty({ description: 'request status' })
  @Expose()
  approval_status: string;

  @ApiProperty({ description: 'request current approver id' })
  @Expose()
  current_approverId: string;
  
  @ApiProperty({ description: 'request current approver name' })
  @Expose()
  current_approver_name: string;
}
