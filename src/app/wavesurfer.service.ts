import { Injectable } from '@angular/core';

import * as WaveSurfer from 'wavesurfer.js';
import * as WaveSurferRegions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import * as WaveSurferTimeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js';

import { Subject } from 'rxjs';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WavesurferService {



  currentTimeSrc = new Subject<number>();
  ct;
  wave;
  isPlaying: boolean = false;
  isPaused: boolean = false;
  isStopped: boolean = true;
  playStatus = 'stopped';
  url = "https://ia800508.us.archive.org/15/items/LoveThemeFromTheGodfather/02LoveThemeFromTheGodfather.mp3";

  constructor() {
    if (!this.wave) {
      this.generateWaveform();
    }


    Promise.resolve().then(() => this.wave.load(this.url));
  }

  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.wave = WaveSurfer.create({
        "container": "#waveform",
        "backgroundColor": "#000000",
        "cursorColor": "#333",
        "progressColor": "#555",
        "waveColor": "#00eeff",
        "barHeight": 1,
        "barMinHeight": 1,
        "barWidth": 5,
        "normalize": true,
        "backend": "WebAudio",
        "responsive": true,
        "hideScrollbar": true,
        "height": 100,
        "plugins": [
        WaveSurferTimeline.create({
          container: '#wave-timeline'
        })
      ]
      });



      this.wave.on('ready', () => {


        this.wave.play();
        this.isPlaying = true;
      });



      this.wave.on('audioprocess', () => this.waveOnAudioprocess());
      this.wave.on('play', () => this.playbackAction('play'));
      this.wave.on('pause', () => this.playbackAction('pause'));
      this.wave.on('seek', () => this.playbackAction('seek'));
      this.wave.on('finish', () => this.waveOnFinish());

      this.wave.on('region-created', console.log);
      this.wave.on('region-click',  console.log);


    });
  }

  playbackAction(action) {
    this.isStopped = false;
    if (action == 'pause') {
      this.isPaused = true;
    } else {
      this.isPaused = false;
      if (this.wave.isPlaying() == false) {
        this.isStopped = true;
      }
    }

    this.isPlaying = this.wave.isPlaying();
    const source = interval(100);
    const subscribe = source.subscribe(val => val);
  }

  onPreviewPressed(): void {
    if (!this.wave) {
      this.generateWaveform();
    }


    Promise.resolve().then(() => this.wave.load(this.url));
  }

  onStopPressed(): void {
    this.wave.stop();
    this.currentTimeSrc.next(0);
  }

  waveOnFinish() {
    console.log('finished');
    this.wave.play();
  }
  waveOnAudioprocess() {
    this.isPlaying = true;
    this.currentTimeSrc.next(this.wave.getCurrentTime().toFixed(2));
    //console.log(this.wave.getCurrentTime())
  }
  playPause() {
    this.wave.playPause();
  }

  updatePlayStatus(status) {
    switch (status) {
      case 'stopped':
        this.isPlaying = false;
        this.isPaused = false;
        this.isStopped = true;
        this.playStatus = 'stopped';
        break;
      case 'playing':
        this.isPlaying = true;
        this.isPaused = false;
        this.isStopped = false;
        this.playStatus = 'playing';
        break;
      case 'paused':
        this.isPlaying = false;
        this.isPaused = true;
        this.isStopped = false;
        this.playStatus = 'paused';
        break;
      default:
        return;

    }
  }

  playTrack(file) {

    Promise.resolve().then(() => this.wave.load(file));

    this.wave.on('ready', () => {
      this.wave.play();
    });
  }

}
