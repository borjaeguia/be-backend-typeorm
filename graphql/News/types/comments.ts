import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { User } from '../../Users/types/user';
import { New } from './new';
import { PageInfo } from '../../Common/types/page_info';

@ObjectType()
@Entity("new_comments")
export class NewsComments extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => New)
  @ManyToOne(() => New, (newDetails: New) => newDetails.id)
  @JoinColumn({ name: "news" })
  id_new: string;

  @Field(() => String)
  @Column({ type: String })
  text: string;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "created_by" })
  created_by: User;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}

@ObjectType()
export class NewsCommentsPaginated {
  @Field(() => [NewsComments])
  elements: NewsComments[];

  @Field(() => PageInfo)
  info: PageInfo;
}

