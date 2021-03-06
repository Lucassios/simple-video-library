import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { VideosComponent } from './components/videos/videos.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VideoEditionComponent } from './components/sidebar/video-edition/video-edition.component';
import { SecondsToDateTimePipe } from './pipes/seconds-to-date-time.pipe';
import { BarRatingModule } from "ngx-bar-rating";
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterComponent } from './components/videos/filter/filter.component';
import { ModalComponent } from './components/modal/modal.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { BytesPipe } from './pipes/bytes.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    WebviewDirective,
    HeaderComponent,
    SidebarComponent,
    VideosComponent,
    SettingsComponent,
    VideoEditionComponent,
    SecondsToDateTimePipe,
    BytesPipe,
    FilterComponent,
    ModalComponent
  ],
  imports: [
    TagInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BarRatingModule,
    InfiniteScrollModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
