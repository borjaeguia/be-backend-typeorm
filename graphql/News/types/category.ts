import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { User } from '../../Users/types/user';
import { New } from './new';
import { PageInfo } from '../../Common/types/page_info';

@ObjectType()
@Entity("new_categories")
export class NewCategory extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ type: String })
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "created_by" })
  created_by: User;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => New, (newDetails) => newDetails.categories)
  news: New[];
}

@ObjectType()
export class NewCategoriesPaginated {
  @Field(() => [NewCategory])
  elements: NewCategory[];

  @Field(() => PageInfo)
  info: PageInfo;
}

