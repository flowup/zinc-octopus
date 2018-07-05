import { Component, Input, OnDestroy } from '@angular/core';
import { AppStateModel } from '../../models/app-state.model';
import { Store } from '@ngrx/store';
import { TransferModel } from '../../models/transfer.model';
import { interval, Observable, Subscription } from 'rxjs/index';
import { $cellsByIds } from '../../reducers/cell.reducer';
import { map } from 'rxjs/internal/operators';
import { CellModel } from '../../models/cell.model';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { $meId } from '../../reducers/me.reducer';

@Component({
  selector: 'zo-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnDestroy {
  transferX: Observable<number>;
  transferY: Observable<number>;
  transferWeight: number;
  transferClass: 'transfer-mine' | 'transfer-theirs' | 'transfer-neutral';
  private cellSub: Subscription;

  constructor(private readonly store: Store<AppStateModel>) { }

  ngOnDestroy(): void {
    if (this.cellSub != null) {
      this.cellSub.unsubscribe();
    }
  }

  @Input()
  set transfer(transfer: TransferModel) {
    this.ngOnDestroy();
    this.transferWeight = transfer.weight;
    this.cellSub = this.store
      .select((state): [CellModel[], string] => [
        $cellsByIds(transfer.from, transfer.to)(state),
        $meId(state)
      ])
      .subscribe(([cells, me]) => {
        const {start, end} = transfer;
        const [fromCell, toCell] = cells;
        const parameter = interval(0, animationFrame)
          .pipe(map(() => Math.min(Math.max(0, (Date.now() - start) / (end - start)), 1)));
        this.transferX = parameter.pipe(map(t => fromCell.x + (toCell.x - fromCell.x) * t));
        this.transferY = parameter.pipe(map(t => fromCell.y + (toCell.y - fromCell.y) * t));

        switch (transfer.owner) {
          case me:
            this.transferClass = 'transfer-mine';
            break;
          case null:
          case undefined:
            this.transferClass = 'transfer-neutral';
            break;
          default:
            this.transferClass = 'transfer-theirs';
        }
      });
  }


}
