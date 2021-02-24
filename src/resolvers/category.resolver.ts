import { Arg, Field, FieldResolver, ObjectType, Query, Resolver, Root } from "type-graphql";
import axios from "axios";
import { Product } from "./product.resolver";

@ObjectType()
export class Category {

    @Field()
    id!: number;

    @Field()
    name!: string;

}

@Resolver()
export class CategoryResolver {

    @Query(_ => [Category])
    async categories(): Promise<Category[]> {
        const categories = (await axios.get<Category[]>("http://localhost:4000/api/categories")).data;
        return categories;
    }

    @Query(_ => Category)
    async categoryById(
        @Arg("id")
        id: number
    ): Promise<Category> {
        const category = (await axios.get<Category>("http://localhost:4000/api/categories/" + id)).data;
        return category;
    }
}

@Resolver(of => Category)
export class CategoryExtensionResolver {

    @FieldResolver(_ => [Product])
    async products(@Root() category: Category): Promise<Product[]> {
        const products = (await axios.get<Product[]>("http://localhost:4000/api/products")).data;
        return products.filter(p => p.categoryId === category.id)
    }

}


