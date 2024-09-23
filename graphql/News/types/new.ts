import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { User } from '../../Users/types/user'
import { PageInfo } from '../../Common/types/page_info';
import { NewCategory } from './category';

@ObjectType()
@Entity("news")
export class New extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ type: String })
  title: string;

  @Field(() => String)
  @Column({ type: String })
  text: string;

  @Field(() => String)
  @Column({ type: String })
  short_text: string;

  @Field(() => String)
  @Column({ nullable: true, type: String })
  image: String;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.id)
  created_by: User;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.id)
  updated_by: User;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => NewCategory)
  @JoinTable()
  @Field(() => [NewCategory])
  categories: NewCategory[];
}

@ObjectType()
export class NewsPaginated {
  @Field(() => [New])
  elements: New[];

  @Field(() => PageInfo)
  info: PageInfo;
}