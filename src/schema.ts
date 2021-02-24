import { buildSchema } from "type-graphql";
import { CategoryExtensionResolver, CategoryResolver } from "./resolvers/category.resolver";
import { ProductExtensionResolver, ProductResolver } from "./resolvers/product.resolver";
import { MeasurementUnitResolver } from "./resolvers/measurement-unit.resolver";

export const graphqlSchema = async () => {
    return await buildSchema({
        resolvers: [
            ProductResolver,
            CategoryResolver,
            MeasurementUnitResolver,
            ProductExtensionResolver,
            CategoryExtensionResolver
        ],
        emitSchemaFile: {
            path: __dirname + "/../schema.gql",
            commentDescriptions: true,
            sortedSchema: false, // by default the printed schema is sorted alphabetically
        },
    });
};