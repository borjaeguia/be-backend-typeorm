
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateNewInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  text: string;

  @Field(() => String)
  short_text: string;


  @Field(() => String)
  image: string;


  @Field(() => [Number])
  categories: Number[]; // Este campo contendrá los IDs de las categorías asociadas

  @Field(() => String,{ nullable: true })
  location: string;

  @Field(() => String,{ nullable: true })
  group: string;

  @Field(() => String,{ nullable: true })
  event: string;

  @Field(() => String,{ nullable: true })
  artist: string;
}

@InputType()
export class UpdateNewInput {

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  text: string;

  @Field(() => String, { nullable: true })
  short_text: string;

  @Field(() => String, { nullable: true })
  image: String;

  @Field(() => [Number], { nullable: true })
  categories: Number[];

  @Field(() => String,{ nullable: true })
  location: string;

  @Field(() => String,{ nullable: true })
  group: string;

  @Field(() => String,{ nullable: true })
  event: string;

  @Field(() => String,{ nullable: true })
  artist: string;
}

@InputType()
export class NewFilter {

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  text: string;

  @Field(() => String, { nullable: true })
  short_text: string;

  @Field(() => String, { nullable: true })
  image: String;

  @Field(() => String, { nullable: true })
  category: String;

  @Field(() => String, { nullable: true })
  location: String;

  @Field(() => Number, { nullable: true })
  page: number

  @Field(() => Number, { nullable: true })
  limit: number
}

