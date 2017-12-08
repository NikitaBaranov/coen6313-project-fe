import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Image} from '../shared/image.model';
import {Request} from '../shared/request.model';
import {RequestService} from '../shared/requestService';
import {Result} from '../shared/result.model';

@Component({
  selector: 'app-recognition',
  templateUrl: './recognition.component.html',
  styleUrls: ['./recognition.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecognitionComponent implements OnInit {
  request: Request;
  result: Result;

  constructor(private requestService: RequestService) {
  }

  ngOnInit() {
    this.result = new Result([0, 0, 0, 0, 0, 0, 0, 0, 0, 0], null);
  }

  onRecogniseClick(image: Image) {
    this.request = new Request(image);
    this.requestService.recognise(this.request).then(result => this.result = result);
    console.log(this.result);
  }

  onClearImgClick() {
    this.result = new Result([0, 0, 0, 0, 0, 0, 0, 0, 0, 0], null);
  }
}
