import { Component, OnInit, ViewChild, Input} from '@angular/core';
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
  @ViewChild('myvideo') remoteVideo: HTMLVideoElement;
  @ViewChild('localvideo') localVideo: HTMLVideoElement;

  constructor() {
   
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
      remoteVideosEl: 'remoteVideo',
      // immediately ask for camera access
      autoRequestMedia: true,
      debug: false,
      detectSpeakingEvents: true,
      autoAdjustMic: false,
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
      console.log('video added', peer);
      const remotes = document.getElementById('remotes');
      if (remotes) {
          const container = document.createElement('div');
          container.className = 'videoContainer';
          container.id = 'container_' + this.peer.getDomId(peer);
          container.appendChild(video);

          // suppress contextmenu
          video.oncontextmenu = function () { return false; };

          // resize the video on click
          video.onclick = function () {
              container.style.width = video.videoWidth + 'px';
              container.style.height = video.videoHeight + 'px';
          };

          // show the remote volume
          const vol = document.createElement('meter');
          vol.id = 'volume_' + peer.id;
          vol.className = 'volume';
          vol.min = -45;
          vol.max = -20;
          vol.low = -40;
          vol.high = -25;
          container.appendChild(vol);

          // show the ice connection state
          if (peer && peer.pc) {
              const connstate = document.createElement('div');
              connstate.className = 'connectionstate';
              container.appendChild(connstate);
              peer.pc.on('iceConnectionStateChange', function (event) {
                  switch (peer.pc.iceConnectionState) {
                  case 'checking':
                      connstate.innerText = 'Connecting to peer...';
                      break;
                  case 'connected':
                  case 'completed': // on caller side
                     //  $(vol).show();
                      connstate.innerText = 'Connection established.';
                      break;
                  case 'disconnected':
                      connstate.innerText = 'Disconnected.';
                      break;
                  case 'failed':
                      connstate.innerText = 'Connection failed.';
                      break;
                  case 'closed':
                      connstate.innerText = 'Connection closed.';
                      break;
                  }
              });
          }
          remotes.appendChild(container);
      }
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

    // Since we use this twice we put it here
    function setRoom(name) {
        document.querySelector('form').remove();
        document.getElementById('title').innerText = 'Room: ' + name;
        document.getElementById('subTitle').innerText =  'Link to join: ' + location.href;
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
