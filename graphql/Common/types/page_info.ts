
import { ObjectType, Field } from 'type-graphql';

@ObjectType() 
export class PageInfo {
    @Field(() => Boolean)
    hasNextPage: Boolean;
  
    @Field(() => Boolean)
    hasPreviousPage: Boolean;

    @Field(() => Number)
    totalPages: Number;
  
    @Field(() => Number)
    currentPage: Number;
}
