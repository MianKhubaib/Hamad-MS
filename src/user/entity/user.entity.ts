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
  Unique,
} from 'sequelize-typescript';

// could be considered as user roles.
export enum Persona {
  Requester = 'requester',
  RequestManager = 'request-manager',
  Collaborator = 'collaborator',
  Admin = 'admin',
}

@Table({ tableName: 'user', timestamps: true })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  email: string;

  @Column
  display_name: string;

  @Unique
  @Column
  teams_emp_id: string;

  @Column
  avatar: string;

  @Column({ type: DataType.ENUM(...Object.values(Persona)) })
  persona: string;

  @CreatedAt
  creation_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deletion_at: Date;
}
