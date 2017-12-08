import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';
import {RequestService} from '../../shared/requestService';
import {Image} from '../../shared/image.model';

@Component({
  selector: 'app-draw-input',
  templateUrl: './draw-input.component.html',
  styleUrls: ['./draw-input.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DrawInputComponent implements OnInit {
  @Output() recognizeClick = new EventEmitter<Image>();
  @Output() clearClick = new EventEmitter<null>();
  @ViewChild('canvas') public canvas: ElementRef;
  @Input() public width = 280;
  @Input() public height = 280;

  private cx: CanvasRenderingContext2D;
  private image: number[];

  constructor(private requestService: RequestService) {
  }

  ngOnInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;
    // canvasEl. = this.height;
    // canvasEl.style.left = '300px'
    canvasEl.style.marginLeft = '85px';
    canvasEl.style.marginTop = '30px';
    canvasEl.style.marginTop = '30px';
    // canvasEl.style.height = canvasEl.parentElement.offsetHeight.toFixed(); // '100%';
    // canvasEl.style.position = 'absolute';

    this.cx.lineWidth = 40;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    console.log(canvasEl);
    this.captureEvents(canvasEl);
  }

  public recognise(): void {
    const original: number[] = Array.from(this.cx.getImageData(0, 0, this.width, this.height).data);
    const blackImg: number[] = new Array(28400);
    let indexIn;
    let indexOut = 0;
    for (indexIn = 3; indexIn <= original.length; indexIn += 4) {
      blackImg[indexOut] = original[indexIn];
      indexOut++;
    }

    const pooledImage: number[] = new Array(284);
    indexOut = 0;
    let indexInX: number;
    let indexInY: number;
    let indexInCount: number;
    for (indexInY = 0; indexInY < blackImg.length; indexInY += 2800) {
      // console.log('indexInY ' + indexInY);
      for (indexInX = 0; indexInX < 280; indexInX += 10) {
        // console.log('indexInX ' + indexInX);
        let max = 0;
        let localMax = 0;
        for (indexInCount = 0; indexInCount < 10; indexInCount++) {
          localMax = blackImg
            .slice(indexInY + indexInX + indexInCount, indexInY + indexInX + indexInCount + 9)
            .reduce(function (a, b) {
              return Math.max(a, b);
            });
          // console.log('slice ' + blackImg.slice(indexInY + indexInX + indexInCount, indexInY + indexInX + indexInCount + 9));
          // console.log('localMax  ' + localMax);
          if (localMax > max) {
            max = localMax;
          }
        }
        pooledImage[indexOut] = max;
        indexOut++;
      }
      // let indexLog = 0;
      // for (indexLog = 0; indexLog < 28; indexLog ++ ){
      //   console.log(pooledImage.slice(28 * indexLog, 28 * indexLog + 27));
      // }
    }
    // this.image = Array.from(this.cx.getImageData(0, 0, this.width, this.height).data);
    this.recognizeClick.emit(pooledImage);
  }

  public clear() {
    this.cx.clearRect(0, 0, this.width, this.height);
    this.clearClick.emit(null);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    Observable
      .fromEvent(canvasEl, 'mousedown')
      .switchMap((e) => {
        return Observable
          .fromEvent(canvasEl, 'mousemove')
          .takeUntil(Observable.fromEvent(canvasEl, 'mouseup'))
          .pairwise();
      })
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });

    Observable
      .fromEvent(canvasEl, 'touchstart')
      .switchMap((e) => {
        return Observable
          .fromEvent(canvasEl, 'touchmove')
          .takeUntil(Observable.fromEvent(canvasEl, 'touchend'))
          .pairwise();
      })
      .subscribe((res: [TouchEvent, TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].touches[0].clientX - rect.left,
          y: res[0].touches[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].touches[0].clientX - rect.left,
          y: res[1].touches[0].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }
}
