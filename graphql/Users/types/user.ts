import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID,registerEnumType } from 'type-graphql';
import { EncryptionTransformer } from 'typeorm-encrypted';
import { PageInfo } from '../../Common/types/page_info';

export enum UserRole {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  USER = "user",
  
}
registerEnumType(UserRole, {
  name: "UserRole",
  description: "Rol de usuarios",
});

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ nullable: true, type: String })
  first_name: string;

  @Field(() => String)
  @Column({ nullable: true, type: String })
  last_name: string;

  
  @Field(() => String)
  @Column({ nullable: true, type: String })
  email: string;
  
  @Field(() => String)
  @Column({transformer: new EncryptionTransformer({
    key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
    algorithm: 'aes-256-cbc',
    ivLength: 16,
    iv: 'ff5ac19190424b1d88f9419ef949ae56'
  })})
  password: string;
  
  @Field(() => UserRole)
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Field(() => String)
  @Column({ nullable: true, type: String })
  phone: string;

  @Field(() => String)
  @Column({ nullable: true, type: String })
  dni: string;
}

@ObjectType()
export class LoginReturn  {
  @Field(() => String)
  token: string;
}

@ObjectType()
  export class UsersPaginated{
    @Field(() => [User])
    elements: User[];

    @Field(() => PageInfo)
    info: PageInfo;
  }

