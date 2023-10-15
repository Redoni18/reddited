import { EntityManager, Connection, IDatabaseDriver } from "@mikro-orm/core"
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql"
import { Request, Response } from "express"

export type MyContext = {
    em: SqlEntityManager<PostgreSqlDriver> & EntityManager<IDatabaseDriver<Connection>>
    req: Request,
    res: Response,
}