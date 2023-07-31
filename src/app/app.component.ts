import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AndroidShortcuts } from 'capacitor-android-shortcuts';
import { ThreeDeeTouch, ThreeDeeTouchQuickAction, ThreeDeeTouchForceTouch } from '@awesome-cordova-plugins/three-dee-touch/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private navCtrl: NavController,
    private threeDeeTouch: ThreeDeeTouch,
    private platform: Platform
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
