import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  ForeignKey,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';
import { BuiRequest } from './bui_request.entity';

@Table({ tableName: 'approver_chain', timestamps: true })
export class BuiApproverChain extends Model<BuiApproverChain> {
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
  priority: number;

  @CreatedAt
  creation_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
