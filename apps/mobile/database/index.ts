// app/database/index.ts
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { vireauSchema } from './schema';
import migrations from './migrations';

import Regatta from './models/Regatta';
import Boat from './models/Boat';
import Race from './models/Race';
import Timer from './models/Timer';

const adapter = new SQLiteAdapter({
  schema: vireauSchema,
  migrations,
});

export const database = new Database({
  adapter,
  modelClasses: [Regatta, Boat, Race, Timer],
  actionsEnabled: true,
});
