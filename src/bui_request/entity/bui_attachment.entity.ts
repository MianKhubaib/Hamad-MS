import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';
import { BuiRequest } from './bui_request.entity';

@Table({ tableName: 'bui_attachments', timestamps: true })
export class Attachment extends Model<Attachment> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => BuiRequest)
  @Column
  bui_request_id: number;

  @ForeignKey(() => User)
  @Column
  approver_id: number;

  @Column
  type: string;

  @Column
  url: string;

  @CreatedAt
  creation_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deletion_at: Date;
}
