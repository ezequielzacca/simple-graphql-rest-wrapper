import { Arg, Field, ObjectType, Query, Resolver, Root } from "type-graphql";
import axios from "axios";

@ObjectType()
export class MeasurementUnit {

    @Field()
    id!: number;

    @Field()
    name!: string;

}

@Resolver()
export class MeasurementUnitResolver {

    @Query(_ => [MeasurementUnit])
    async measurementUnits(): Promise<MeasurementUnit[]> {
        const measurementUnits = (await axios.get<MeasurementUnit[]>("http://localhost:4000/api/measurement/units")).data;
        return measurementUnits;
    }

    @Query(_ => MeasurementUnit)
    async measurementUnitById(
        @Arg("id")
        id: number
    ): Promise<MeasurementUnit> {
        const measurementUnit = (await axios.get<MeasurementUnit>("http://localhost:4000/api/measurement/units/" + id)).data;
        return measurementUnit;
    }
}


