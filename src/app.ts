import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import { graphqlSchema } from "./schema";

const startServer = async () => {
    const app = express();
    app.use(express.json({ limit: "5mb" }));
    app.use(express.text({ limit: "5mb" }));
    app.use(cors());
    app.use(express.static(path.join(__dirname, "wwwroot")));
    const httpServer = new http.Server(app);
    const schema = await graphqlSchema();

    const server = new ApolloServer({
        introspection: true,
        playground: true,
        schema
    });

    server.applyMiddleware({ app });
    server.installSubscriptionHandlers(httpServer);

    const PORT = +(process.env.PORT || 4001);
    const apolloGraphQLServerUrl = `localhost:${PORT}${server.graphqlPath}`;

    httpServer.listen({ port: PORT }, async () => {
        console.log(`🚀 Server ready at http://${apolloGraphQLServerUrl}`);
        console.log(`🚀 Subscriptions ready at ws://${apolloGraphQLServerUrl}`);
    });
    return apolloGraphQLServerUrl;
};

startServer();
process.on("warning", (e) => console.warn(e.stack));
