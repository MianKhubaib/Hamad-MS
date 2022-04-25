import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';

export enum Status {
  Pending = 'requestor',
  Withdrawed = 'withdrawed',
  Rejected = 'rejected',
  Approved = 'approved',
}

export enum OverallState {
  Unassigned = 'unassigned',
  PendingSpecs = 'pending-specs',
  InDevelopment = 'in-development',
  InQa = 'in-qa',
  UserAcceptance = 'user-acceptance',
  Waiting = 'waiting',
  Completed = 'completed',
}

@Table({ tableName: 'bui_request', timestamps: true })
export class BuiRequest extends Model<BuiRequest> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  title: string;

  @Column
  purpose: string;

  @Column
  description: string;

  @Column
  frequency: string;

  @Column
  intended_audiance: string;

  @Column
  is_research_based: boolean;

  @Column
  required_at: Date;

  @Column
  comment: string;

  @ForeignKey(() => User)
  @Column
  created_by: number;

  @Column({ type: DataType.ENUM(...Object.values(Status)) })
  status: string;

  @ForeignKey(() => User)
  @Column
  manager_id: number;

  @Column({ type: DataType.ENUM(...Object.values(OverallState)) })
  overallState: string;

  @Column
  next_approver: number;

  @Column
  hygene_check_id: number;

  @Column
  delivery_check_id: number;

  @CreatedAt
  creation_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
