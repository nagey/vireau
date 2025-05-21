// app/database/index.ts
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { vireauSchema } from './schema';
import Regatta from './models/Regatta';
import Boat from './models/Boat';
import Race from './models/Race';
import Timer from './models/Timer';

const adapter = new SQLiteAdapter({
  schema: vireauSchema,
});

export const database = new Database({
  adapter,
  modelClasses: [Regatta, Boat, Race, Timer],
  actionsEnabled: true,
});
