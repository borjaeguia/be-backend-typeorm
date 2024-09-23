
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateNewCategoryInput {
  @Field(() => String)
  name: string;
}

@InputType()
export class UpdateNewCategoryInput {
  @Field(() => String, { nullable: true })
  name: string;
}

@InputType()
export class NewCategoryFilter {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => Number, { nullable: true })
  page: number

  @Field(() => Number, { nullable: true })
  limit: number
}

