
import { Field,  InputType } from 'type-graphql';
  
  @InputType()
  export class CreateNewsCommentInput {
    @Field(() => String)
    id_new: string;
  
    @Field(() => String)
    text: string;
    
  
    @Field(() => String)
    created_by: string;
  }
  
  @InputType()
  export class UpdateNewsCommentInput {
    @Field(() => String,{ nullable: true })
    text: string;
  
    
  }

  @InputType()
  export class NewsCommentFilter {
    @Field(() => String)
    id_new: string;
  
    @Field(()=>Number,{ nullable: true })
    page: number

    @Field(()=>Number,{ nullable: true })
    limit: number
  }
  
  