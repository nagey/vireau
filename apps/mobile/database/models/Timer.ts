// app/database/models/Timer.ts

import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';
import Boat from './Boat';
import Race from './Race';

export default class Timer extends Model {
  static table = 'timers';

  @field('time') time!: number | null;
  @field('created_at') createdAt!: number | null;
  @field('updated_at') updatedAt!: number | null;

  // Foreign key relations
  @relation('boats', 'boat_id') boat!: Boat;
  @relation('races', 'race_id') race!: Race;
}
