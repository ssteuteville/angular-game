import { BlackjackTableComponent } from './blackjack-table/blackjack-table.component';
import { BlackjackService } from './blackjack-table/service/blackjack-service';
import { PossibleScores } from './blackjack-table/possible-scores.pipe';

export const COMPONENT_DECLARATIONS = [
  BlackjackTableComponent,
  PossibleScores
];

export const COMPONENT_PROVIDERS = [
  BlackjackService
];
