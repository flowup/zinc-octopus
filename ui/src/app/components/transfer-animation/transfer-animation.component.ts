import { Component, Input } from '@angular/core';
import { interval, Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { TransferAnimationModel, TransferOwner } from '../../models/transfer-animation.model';

@Component({
  selector: 'zo-transfer-animation',
  templateUrl: './transfer-animation.component.html',
  styleUrls: ['./transfer-animation.component.scss']
})
export class TransferAnimationComponent {
  readonly TransferOwner = TransferOwner;

  transferX: Observable<number>;
  transferY: Observable<number>;
  transferOwner: TransferOwner;
  transferWeight: number;

  @Input()
  set transferAnimation({fromX, fromY, toX, toY, startTime, endTime, owner, weight}: TransferAnimationModel) {
    const parameter = interval(0, animationFrame).pipe(
      map(() => Math.min(Math.max(0, (Date.now() - startTime) / (endTime - startTime)), 1))
    );
    this.transferX = parameter.pipe(map(t => fromX + (toX - fromX) * t));
    this.transferY = parameter.pipe(map(t => fromY + (toY - fromY) * t));
    this.transferOwner = owner;
    this.transferWeight = weight;
  }
}
