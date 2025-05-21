// app/database/schema.ts

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const vireauSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'regattas',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'public', type: 'boolean', isOptional: true },
        { name: 'image', type: 'string', isOptional: true },
        { name: 'start_date', type: 'number', isOptional: true }, // unix timestamp
        { name: 'end_date', type: 'number', isOptional: true },
        { name: 'location', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number', isOptional: false },
        { name: 'updated_at', type: 'number', isOptional: false },
        // You may want to add a synced/dirty flag for offline sync
      ]
    }),
    tableSchema({
      name: 'boats',
      columns: [
        { name: 'regatta_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'sail_number', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number', isOptional: false },
        { name: 'updated_at', type: 'number', isOptional: false },
      ]
    }),
    tableSchema({
      name: 'races',
      columns: [
        { name: 'regatta_id', type: 'string', isIndexed: true },
        { name: 'number', type: 'number' }, // race number (1,2,...)
        { name: 'created_at', type: 'number', isOptional: false },
        { name: 'updated_at', type: 'number', isOptional: false },
      ]
    }),
    tableSchema({
      name: 'timers',
      columns: [
        { name: 'boat_id', type: 'string', isIndexed: true },
        { name: 'race_id', type: 'string', isIndexed: true },
        { name: 'time', type: 'number', isOptional: true }, // ms or seconds
        { name: 'created_at', type: 'number', isOptional: false },
        { name: 'updated_at', type: 'number', isOptional: false },
      ]
    }),
  ]
});
