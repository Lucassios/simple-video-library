import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideosComponent } from './components/videos/videos.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
    { path: '', component: VideosComponent },
    { path: 'videos/library/:libraryId', component: VideosComponent },
    { path: 'videos/actor/:actorName', component: VideosComponent },
    { path: 'videos/tag/:tagName', component: VideosComponent },
    { path: 'settings', component: SettingsComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
