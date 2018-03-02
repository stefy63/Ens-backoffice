import { Component, OnInit, ViewChild, Input, ContentChildren, ViewChildren, Renderer2, ElementRef} from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { Observable } from 'rxjs/Observable';
import simplewebrtc from 'simplewebrtc';

@Component({
  selector: 'fuse-ticket-video-chat',
  templateUrl: './ticket-video-chat.component.html',
  styleUrls: ['./ticket-video-chat.component.scss']
})
export class TicketVideoChatComponent implements OnInit {
 
  
  public peer: any;
  public remoteid;
  public mypeerid;
  public n = <any>navigator;
  public room: string;


  @Input('openTicket') ticket:  ITicket;
  @ViewChild('remoteVideo') remoteVideo: HTMLVideoElement;
  @ViewChild('localvideo') localVideo: HTMLDivElement;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {
   
   }



  ngOnInit() {
    this.n.getUserMedia = this.n.getUserMedia ||
                        this.n.webkitGetUserMedia ||
                        this.n.mozGetUserMedia ||
                        this.n.mediaDevices.getUserMedia ||
                        this.n.msGetUserMedia;
    
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
      // you can name it anything 
      this.peer.joinRoom('ens');
    });

    this.peer.on('localStream', (stream) => {
      
    });
    // we did not get access to the camera
    this.peer.on('localMediaError', function (err) {
    });
    this.peer.on('localScreenAdded', function (video) {
    });
    this.peer.on('localScreenRemoved', function (video) {
    });
    this.peer.on('videoAdded', function (video, peer) {
      const el: HTMLVideoElement = document.querySelector('#remoteVideos video');
      el.setAttribute('width', '100%');
    });

    this.peer.on('videoRemoved', function (video, peer) {
    });

    // local volume has changed
    this.peer.on('volumeChange', function (volume, treshold) {
    });
    // remote volume has changed
    this.peer.on('remoteVolumeChange', function (peer, volume) {
    });

    // local p2p/ice failure
    this.peer.on('iceFailed', function (peer) {
    });

    // remote p2p/ice failure
    this.peer.on('connectivityError', function (peer) {
    });

    // Since we use this twice we put it HTMLVideoElementhere
    function setRoom(name) {
        // document.querySelector('form').remove();
        // document.getElementById('title').innerText = 'Room: ' + name;
        // document.getElementById('subTitle').innerText =  'Link to join: ' + location.href;
        // $('body').addClass('active');
    }

    // if (room) {
    //     this.setRoom(room);
    // } else {
    //     $('form').submit(function () {
    //         var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
    //         this.peer.createRoom(val, function (err, name) {
    //             console.log(' create room cb', arguments);

    //             var newUrl = location.pathname + '?' + name;
    //             if (!err) {
    //                 history.replaceState({foo: 'bar'}, null, newUrl);
    //                 setRoom(name);
    //             } else {
    //                 console.log(err);
    //             }
    //         });
    //         return false;
    //     });
    // }

   

  }







}
