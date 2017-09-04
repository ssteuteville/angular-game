import { BlackjackTableComponent } from './blackjack-table/blackjack-table.component';
import { BlackjackService } from './blackjack-table/service/blackjack-service';
import { PossibleScores } from './blackjack-table/possible-scores.pipe';
import { ImageFormat } from './blackjack-table/image-format.pipe';

export const COMPONENT_DECLARATIONS = [
  BlackjackTableComponent,
  PossibleScores,
  ImageFormat
];

export const COMPONENT_PROVIDERS = [
  BlackjackService
];
