import { Component, OnInit } from '@angular/core';
import { WavesurferService } from '../wavesurfer.service';
@Component({
  selector: 'app-wavesurfer',
  templateUrl: './wavesurfer.component.html',
  styleUrls: ['./wavesurfer.component.scss']
})
export class WavesurferComponent implements OnInit {

  constructor(public ws: WavesurferService) {



   }

  ngOnInit(): void {
  }

}
