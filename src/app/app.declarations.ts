import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NoContentComponent } from './no-content/no-content.component';
import { XLargeDirective } from './home/x-large/x-large.directive';
import { COMPONENT_DECLARATIONS } from './components/index';

export const APP_DECLARATIONS = [
  AppComponent,
  HomeComponent,
  NoContentComponent,
  XLargeDirective,
  ...COMPONENT_DECLARATIONS
];
