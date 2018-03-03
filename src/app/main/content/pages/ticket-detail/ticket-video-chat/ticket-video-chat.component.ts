import { Component, OnInit, Input} from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { Observable } from 'rxjs/Observable';
import simplewebrtc from 'simplewebrtc';
import {environment} from '../../../../../../environments/environment';


@Component({
  selector: 'fuse-ticket-video-chat',
  templateUrl: './ticket-video-chat.component.html',
  styleUrls: ['./ticket-video-chat.component.scss']
})
export class TicketVideoChatComponent implements OnInit {


  @Input('ticket') data: Observable<ITicket>;

  public peer: any;
  public remoteid;
  public mypeerid;
  public n = <any>navigator;
  public room: string;
  public ticket: ITicket;


  constructor() {

   }



  ngOnInit() {
    this.n.getUserMedia = this.n.getUserMedia ||
      this.n.webkitGetUserMedia ||
      this.n.mozGetUserMedia ||
      this.n.mediaDevices.getUserMedia ||
      this.n.msGetUserMedia;

    this.data.subscribe((data: ITicket) => {
      this.ticket = data;
      this.room = environment.videoChat_room_suffix + this.ticket.id;

      this.peer = new simplewebrtc({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remoteVideos',
        // immediately ask for camera access
        autoRequestMedia: true,
        debug: false,
        // detectSpeakingEvents: true,
        // autoAdjustMic: false,
        // url: 'https://example.com/'
      });

      this.peer.on('readyToCall', () => {
        this.peer.createRoom(this.room, function (err, name) {
          console.log(' create room cb', arguments);
        });

        this.peer.joinRoom(this.room);
      });

      this.peer.on('videoAdded', function (video, peer) {
        const el: HTMLVideoElement = document.querySelector('#remoteVideos video');
        el.setAttribute('width', '100%');
      });

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
