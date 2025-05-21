// app/database/models/Regatta.ts

import { Model } from '@nozbe/watermelondb';
import { field, date, children } from '@nozbe/watermelondb/decorators';
import Boat from './Boat';
import Race from './Race';

export default class Regatta extends Model {
  static table = 'regattas';

  @field('name') name!: string;
  @field('public') public!: boolean;
  @field('image') image!: string | null;
  @field('start_date') startDate!: number | null;
  @field('end_date') endDate!: number | null;
  @field('location') location!: string | null;
  @field('created_at') createdAt!: number | null;
  @field('updated_at') updatedAt!: number | null;

  // Relations
  @children('boats') boats!: Boat[];
  @children('races') races!: Race[];
}
