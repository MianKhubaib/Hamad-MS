import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';
import { BuiRequest } from './bui_request.entity';

@Table({ tableName: 'bui_approval' })
export class BuiApproval extends Model<BuiApproval> {
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
  comment: string;

  @Default(Date.now)
  @CreatedAt
  @Column
  created_at: Date;
}
