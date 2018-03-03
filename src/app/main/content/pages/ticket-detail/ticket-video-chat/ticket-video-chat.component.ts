import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { Observable } from 'rxjs/Observable';
import simplewebrtc from 'simplewebrtc';
import {environment} from '../../../../../../environments/environment';
import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';
import { ToastOptions } from '../../../../../type/toast-options';


@Component({
  selector: 'fuse-ticket-video-chat',
  templateUrl: './ticket-video-chat.component.html',
  styleUrls: ['./ticket-video-chat.component.scss']
})
export class TicketVideoChatComponent implements OnInit, OnDestroy {


  @Input() idTicket: number;

  public peer: any;
  public remoteid;
  public n = <any>navigator;
  public room: string;
  public options = ToastOptions;

  constructor(
    private toast: NotificationsService
  ) {
   }



  ngOnInit() {
    this.n.getUserMedia = this.n.getUserMedia ||
      this.n.webkitGetUserMedia ||
      this.n.mozGetUserMedia ||
      this.n.mediaDevices.getUserMedia ||
      this.n.msGetUserMedia;

      this.options.timeOut = 10000;

      this.room = environment.videoChat_room_suffix + this.idTicket;
      this.peer = new simplewebrtc({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remoteVideos',
        // immediately ask for camera access
        media: { audio: false, video: true },
        autoRequestMedia: true,
        debug: false,
        // detectSpeakingEvents: true,
        // autoAdjustMic: false,
        // url: 'https://example.com/'
      });
           
      this.peer.on('readyToCall', () => {
        this.peer.createRoom(this.room, (err, name) => {
          console.log(' create room cb', this.room);
        });
        this.peer.joinRoom(this.room);
        this.toast.info('In Attesa di Connessione...!');
      });

      this.peer.on('videoAdded', (video, peer) => {
        console.log('video added at ID: ', this.peer.getDomId(peer));
        const remoteVideoElement: Element = document.querySelector('#' + this.peer.getDomId(peer));
        remoteVideoElement.setAttribute('width', '100%');

        if (peer && peer.pc) {
          peer.pc.on('iceConnectionStateChange', (event) => {
            switch (peer.pc.iceConnectionState) {
              case 'checking':
                  this.toast.info('Connessione...!');
                  break;
              case 'connected':
              case 'completed': // on caller side
                  this.toast.success('Connessione Stabilita!');
                  break;
              case 'disconnected':
                  this.toast.warn('Disconnesso!');
                  break;
              case 'failedthis.localvideo.stpp();':
                  this.toast.error('Connessione Fallita!');
                  break;
              case 'closed':
                  this.toast.error('Connessione Chiusa!');
                  break;
            }
          });
        }
      });
      
     
    // this.peer.on('localStream', (stream) => {
    //
    // });
    // // we did not get access to the camera
    // this.peer.on('localMediaError', function (err) {
    // });
    // this.peer.on('localScreenAdded', function (video) {
    // });
    // this.peer.on('localScreenRemoved', function (video) {
    // });
    //
    // this.peer.on('videoRemoved', function (video, peer) {
    // });
    //
    // // local volume has changed
    // this.peer.on('volumeChange', function (volume, treshold) {
    // });
    // // remote volume has changed
    // this.peer.on('remoteVolumeChange', function (peer, volume) {
    // });
    //
    // // local p2p/ice failure
    // this.peer.on('iceFailed', function (peer) {
    // });
    //
    // // remote p2p/ice failure
    // this.peer.on('connectivityError', function (peer) {
    // });



  }

  ngOnDestroy() {
    this.peer.stopLocalVideo();
    this.peer.leaveRoom();
  }
}
