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

@Table({ tableName: 'bui_delivery', timestamps: true })
export class BuiDelivert extends Model<BuiDelivert> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  ba_assessment: string;

  @Column
  ta_assessment: number;

  @ForeignKey(() => User)
  assigned_qa: number;

  @Column
  report_sample: string;

  @Column
  demo_date: Date;

  @Column
  uat_signoff: string;

  @CreatedAt
  creation_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deletion_at: Date;
}
