import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class Approver {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  approval_status: string;

  @Expose()
  approved_at: Date;
}

export class Attachment {
  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  size: number;

  @Expose()
  url: string;
}

export class Comment {
  @Expose()
  author: string;

  @Expose()
  text: string;
}

export class ViewRequestDto {
  @ApiProperty({ description: 'request title' })
  @Expose()
  title: string;

  @Expose()
  is_research_based: boolean;

  @Expose()
  submited_by_name: string;

  @Expose()
  requested_time: Date;

  @Expose()
  required_by: Date;

  @Expose()
  @Type(() => Approver)
  approvers: Approver[];

  @Expose()
  @Transform(({ value }) => (value !== 'attachments' ? JSON.parse(value) : []))
  @Type(() => Attachment)
  attachments: Attachment[];

  @Expose()
  @Transform(({ value }) => (value !== 'comments' ? JSON.parse(value) : []))
  @Type(() => Comment)
  comments: Comment[];
}
