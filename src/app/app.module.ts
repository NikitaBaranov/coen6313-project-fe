import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {RecognitionComponent} from './recognition/recognition.component';
import {DrawInputComponent} from './recognition/draw-input/draw-input.component';
import {ResultComponent} from './recognition/result/result.component';
import {RequestService} from './shared/requestService';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecognitionComponent,
    DrawInputComponent,
    ResultComponent
  ],
  imports: [
    HttpModule,
    BrowserModule
  ],
  providers: [
    RequestService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
