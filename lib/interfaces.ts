import {Future} from 'fluture';

export interface DriverInput {
  future: Future<any, any>,
  category: string
}