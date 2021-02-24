import { Arg, Field, FieldResolver, ObjectType, Query, Resolver, Root } from "type-graphql";
import axios from "axios";
import { Category } from "./category.resolver";
import { MeasurementUnit } from "./measurement-unit.resolver";

@ObjectType()
export class Product {

    @Field()
    id!: number;

    @Field()
    name!: string;

    @Field()
    measurementUnitId!: number;

    @Field()
    categoryId!: number;

    @Field()
    size!: number;
}

@Resolver()
export class ProductResolver {

    @Query(_ => [Product])
    async products(): Promise<Product[]> {
        const products = (await axios.get<Product[]>("http://localhost:4000/api/products")).data;
        return products;
    }

    @Query(_ => Product)
    async productById(
        @Arg("id")
        id: number
    ): Promise<Product> {
        const product = (await axios.get<Product>("http://localhost:4000/api/products/" + id)).data;
        return product;
    }
}

@Resolver(of => Product)
export class ProductExtensionResolver {

    @FieldResolver(_ => Category)
    async category(@Root() product: Product): Promise<Category> {
        const category = (await axios.get<Category>("http://localhost:4000/api/categories/" + product.categoryId)).data;
        return category;
    }

    @FieldResolver(_ => MeasurementUnit)
    async measurementUnit(@Root() product: Product): Promise<MeasurementUnit> {
        const measurementUnit = (await axios.get<MeasurementUnit>("http://localhost:4000/api/measurement/units/" + product.measurementUnitId)).data;
        return measurementUnit;
    }
}


