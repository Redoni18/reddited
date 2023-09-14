import { EntityManager, Connection, IDatabaseDriver } from "@mikro-orm/core"
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql"

export type MyContext = {
    em: SqlEntityManager<PostgreSqlDriver> & EntityManager<IDatabaseDriver<Connection>>
}