import { Component, Input } from '@angular/core';

@Component({
  selector: 'zo-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() theme: 'plain' | 'accent' = 'plain';
}
