import zennv from "zennv"
import { z } from "zod"

export const env = zennv({
    dotenv: true,
    schema: z.object({
        PORT: z.number().default(8080),
        HOST: z.string().default('localhost'),
        DB_CONN: z.string({
            required_error: "Database connection uri is required",
        }),
        SIGNING_SECRET: z.string({
            required_error: "Signing secret is required",
        })
    }),
})