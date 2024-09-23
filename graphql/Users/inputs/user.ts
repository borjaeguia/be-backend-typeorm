import { Field, InputType } from 'type-graphql';

import { UserRole } from '../types/user';


@InputType()
export class CreateUserInput {
  
  @Field(() => String)
  first_name: string;

  @Field(() => String)
  last_name: string;

  
  @Field(() => String)
  email: string;
  
  @Field(() => String)
  password: string;
  
  @Field(type => UserRole)
  role: UserRole;

  @Field(() => String,{ nullable: true })
  phone: string;

  @Field(() => String,{ nullable: true })
  dni: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  first_name?: string;

  @Field({ nullable: true })
  last_name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password: string;

  @Field({nullable: true})
  role: UserRole;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  dni: string;
}

@InputType()
export class UserFilter {
  @Field({ nullable: true })
  first_name?: string;

  @Field({ nullable: true })
  last_name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password: string;

  @Field({nullable: true})
  role: UserRole;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  dni: string;

  @Field(()=>Number,{ nullable: true })
  page: number

  @Field(()=>Number,{ nullable: true })
  limit: number  
}
