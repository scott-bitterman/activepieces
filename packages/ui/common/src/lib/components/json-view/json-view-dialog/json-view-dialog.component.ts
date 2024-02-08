import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { jsonEditorOptionsMonaco } from '../../../utils/consts';
export type JsonViewDialogData = {
  title: string;
  content: unknown;
};

@Component({
  selector: 'ap-json-view-dialog',
  templateUrl: './json-view-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonViewDialogComponent {
  data: JsonViewDialogData;
  jsonEditorOptionsMonaco = jsonEditorOptionsMonaco;
  jsonFormControl: FormControl<unknown>;
  constructor(@Inject(MAT_DIALOG_DATA) dialogData: JsonViewDialogData) {
    this.data = dialogData;
    this.jsonFormControl = new FormControl(
      JSON.stringify(this.data.content, null, 2)
    );
  }
}
