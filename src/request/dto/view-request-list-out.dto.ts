import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ViewRequestListOutDto {
  @ApiProperty({ description: 'request id' })
  @Expose({ name: 'RowKey' })
  id: string;

  @ApiProperty({ description: 'request display id' })
  @Expose()
  @Transform(({ value }) => `Req-${String(value).padStart(3, '0')}`)
  display_id: string;

  @ApiProperty({ description: 'request date' })
  @Expose()
  requested_time: Date;

  @ApiProperty({ description: 'request title' })
  @Expose()
  title: string;

  @ApiProperty({ description: 'request description' })
  @Expose()
  description: string;

  @ApiProperty({ description: 'request purpose' })
  @Expose()
  purpose: string;

  @ApiProperty({ description: 'request required/expected date' })
  @Expose()
  required_by: Date;

  @ApiProperty({ description: 'request status' })
  @Transform(({ value }) => (String(value).startsWith('status') ? null : value))
  @Expose()
  status: string;

  @ApiProperty({ description: 'request approval status' })
  @Expose()
  approval_status: string;

  @ApiProperty({ description: 'request current approver id' })
  @Expose()
  current_approverId: string;

  @ApiProperty({ description: 'request current approver name' })
  @Expose()
  current_approver_name: string;

  @ApiProperty({ description: 'requested by user name' })
  @Expose({ name: 'submited_by_name' })
  requested_by: string;

  @ApiProperty({ description: 'requested by user id' })
  @Expose({ name: 'submited_by_userId' })
  requested_user_id: string;

  @ApiProperty({ description: 'request manager id' })
  @Expose({ name: 'request_manager_id' })
  manager_id: string;

  @ApiProperty({ description: 'request manager details' })
  @Expose({ name: 'request_manager_details' })
  @Transform(({ value }) =>
    String(value).startsWith('request')
      ? 'Unassigned'
      : JSON.parse(value)?.name,
  )
  manager_name: string;
}
