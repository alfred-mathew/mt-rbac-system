import fastify from "fastify";
import { logger } from "./logger";

export async function buildServer() {
    const serverOpts = {
        logger,
    };
    return fastify(serverOpts);
}