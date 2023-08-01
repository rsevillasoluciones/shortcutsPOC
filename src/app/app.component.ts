import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AndroidShortcuts } from 'capacitor-android-shortcuts';
import { ThreeDeeTouch, ThreeDeeTouchQuickAction, ThreeDeeTouchForceTouch } from '@awesome-cordova-plugins/three-dee-touch/ngx';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private navCtrl: NavController,
    private threeDeeTouch: ThreeDeeTouch,
    private platform: Platform,
    private router: Router,
  ) {

    this.platform.ready().then(async () => {

      if (this.platform.is("android")) {
        this.setdynShortcuts();
        AndroidShortcuts.addListener('shortcut', (response: any) => {
          // response.data contains the content of the 'data' property of the created shortcut
          console.log("The shortcut has been triggered");
          console.log("SC information: ", response);
          this.navCtrl.navigateRoot('/alarm', { animated: false });
        });
      }

      if (this.platform.is("ios")) {
        this.threeDeeTouch.isAvailable().then(isAvailable => console.log('3D Touch available? ' + isAvailable));
        // this.setThreeDee();
        this.threeDeeTouch.watchForceTouches()
          .subscribe(
            (data: ThreeDeeTouchForceTouch) => {
              console.log('Force touch %' + data.force);
              console.log('Force touch timestamp: ' + data.timestamp);
              console.log('Force touch x: ' + data.x);
              console.log('Force touch y: ' + data.y);
            }
          );
        this.threeDeeTouch.onHomeIconPressed().subscribe(
          (payload) => {
            // returns an object that is the button you presed
            console.log('Pressed the ${payload.title} button')
            console.log(payload.type)
            this.navCtrl.navigateRoot('/alarm', { animated: false });
          }
        )
      }

      this.platform.backButton.subscribeWithPriority(1, () => {
        if (this.router.url.includes('/home')) {
          App.exitApp();
          return;
        } else {
          this.navCtrl.back({ animated: false });
        }
        Promise.reject();
      });

    });
  }

  setdynShortcuts() {

    // Set dynamic shortcuts
    AndroidShortcuts.isDynamicSupported().then(({ result }) => {
      if (result) {
        AndroidShortcuts.setDynamic({
          items: [
            {
              id: "alarmcancel",
              shortLabel: "Cancelar alarma",
              longLabel: "Función de cancelación de alarma activada",
              icon: {
                type: "Bitmap",
                name: "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"
              },
              data: "Información enviada en evento de pulsación de shortcut",
            },
            // {
            //   id: "mysecondid",
            //   shortLabel: "My sec short label",
            //   longLabel: "My sec long label",
            //   icon: {
            //     type: "Resource",
            //     name: "<vector-asset-name>"
            //   },
            //   data: JSON.stringify({
            //     myProperty: "Pass a stringified JSON object",
            //   }),
            // },
          ],
        });
      }
    });
  }

  setThreeDee() {

    let actions: ThreeDeeTouchQuickAction[] = [
      {
        type: 'checkin',
        title: 'Check in',
        subtitle: 'Quickly check in',
        iconType: 'Compose'
      }
      // {
      //   type: 'share',
      //   title: 'Share',
      //   subtitle: 'Share like you care',
      //   iconType: 'Share'
      // },
      // {
      //   type: 'search',
      //   title: 'Search',
      //   iconType: 'Search'
      // },
      // {
      //   title: 'Show favorites',
      //   iconTemplate: 'HeartTemplate'
      // }
    ];

    this.threeDeeTouch.configureQuickActions(actions);



  }
}
