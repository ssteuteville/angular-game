import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'orDelimiter'})
export class PossibleScores implements PipeTransform {
  transform(value: number[], args: string[]): any {
    if (!value) return value;
    return value.join(' OR ');
  }
}
