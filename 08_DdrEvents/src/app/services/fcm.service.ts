import { Injectable } from '@angular/core';
import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor() { }

  init() {
    // const isPushNotificationsAvailable = 'Notification' in window;
    // if (isPushNotificationsAvailable) {
    //   Notification.requestPermission();
    // }
    const isPushNotificationsAvailable = Capacitor
      .isPluginAvailable('PushNotifications');

    if (isPushNotificationsAvailable) {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.requestPermissions().then(result => {
        console.log('Request permission result', result); // dbg
        
        if (result.receive) {
          PushNotifications.register().then(() => {
            console.log('Push registration success'); // dbg
            FCM.subscribeTo({
              topic: 'events',
            });
          });
        } else {
          console.error('Push permission denied');
        }
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success', token.value); // dbg
      });

      PushNotifications.addListener('pushNotificationReceived', (notificaction: PushNotificationSchema) => {
        console.log('Notification received', notificaction); // dbg
      });

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error)); // dbg
      });
    }
  }

}
