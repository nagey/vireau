// app/database/models/Race.ts

import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';
import Regatta from './Regatta';

export default class Race extends Model {
  static table = 'races';

  @field('number') number!: number;
  @field('created_at') createdAt!: number | null;
  @field('updated_at') updatedAt!: number | null;

  // Foreign key relation
  @relation('regattas', 'regatta_id') regatta!: Regatta;
}
