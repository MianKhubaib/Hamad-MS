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

@Table({ tableName: 'bui_assessment', timestamps: true })
export class BuiAssessment extends Model<BuiAssessment> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  output_type: string;

  @Column
  priority: string;

  @Column
  domain: string;

  @Column
  short_output: string;

  @Column
  full_output: string;

  @Column
  expected_date: Date;

  @Column
  tat: string;

  @ForeignKey(() => User)
  assigned_ba: number;

  @ForeignKey(() => User)
  assigned_ta: number;

  @CreatedAt
  creation_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deletion_at: Date;
}
