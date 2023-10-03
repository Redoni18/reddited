"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20231003160917 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20231003160917 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("id" serial primary key, "username" text not null, "password" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
        this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
        this.addSql('drop table if exists "session" cascade;');
    }
    async down() {
        this.addSql('create table "session" ("sid" varchar not null default null, "sess" json not null default null, "expire" timestamp not null default null, constraint "session_pkey" primary key ("sid"));');
        this.addSql('create index "IDX_session_expire" on "session" ("expire");');
        this.addSql('drop table if exists "user" cascade;');
    }
}
exports.Migration20231003160917 = Migration20231003160917;
//# sourceMappingURL=Migration20231003160917.js.map