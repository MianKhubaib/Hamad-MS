import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  ForeignKey,
  DeletedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';
import { BuiRequest } from './bui_request.entity';

@Table({ tableName: 'bui_progress_note' })
export class BuiProgressNote extends Model<BuiProgressNote> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => BuiRequest)
  @Column
  bui_request_id: number;

  @ForeignKey(() => User)
  @Column
  created_by: number;

  @Column
  text: string;

  @CreatedAt
  creation_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deletion_at: Date;
}
