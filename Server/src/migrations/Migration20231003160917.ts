import { Migration } from '@mikro-orm/migrations';

export class Migration20231003160917 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "username" text not null, "password" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('drop table if exists "session" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "session" ("sid" varchar not null default null, "sess" json not null default null, "expire" timestamp not null default null, constraint "session_pkey" primary key ("sid"));');
    this.addSql('create index "IDX_session_expire" on "session" ("expire");');

    this.addSql('drop table if exists "user" cascade;');
  }

}
