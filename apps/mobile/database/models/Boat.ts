// app/database/models/Boat.ts

import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';
import Regatta from './Regatta';

export default class Boat extends Model {
  static table = 'boats';

  @field('name') name!: string;
  @field('sail_number') sailNumber!: string | null;
  @field('created_at') createdAt!: number | null;
  @field('updated_at') updatedAt!: number | null;

  // Foreign key relation
  @relation('regattas', 'regatta_id') regatta!: Regatta;
}
