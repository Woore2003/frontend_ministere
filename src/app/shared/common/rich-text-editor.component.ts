import { Component, forwardRef, ElementRef, ViewChild, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ]
})
export class RichTextEditorComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Écrivez ici...';
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  content: string = '';
  disabled = false;

  onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: string): void {
    this.content = value || '';
    if (this.editorRef) {
      this.editorRef.nativeElement.innerHTML = this.content;
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  // --- Commandes de formatage ---
  exec(command: string, value?: string) {
    document.execCommand(command, false, value);
    this.updateContent();
    this.editorRef.nativeElement.focus();
  }

  onFormatBlock(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.exec('formatBlock', value);
  }

  onFontName(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.exec('fontName', value);
  }

  onTextColor(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.exec('foreColor', value);
  }

  onHighlight(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.exec('hiliteColor', value);
  }

  insertLink() {
    const url = prompt('Entrez l\'URL du lien :', 'https://');
    if (url) this.exec('createLink', url);
  }

  insertImage() {
    const url = prompt('Entrez l\'URL de l\'image :', 'https://');
    if (url) this.exec('insertImage', url);
  }

  toggleCodeBlock() {
    this.exec('formatBlock', 'pre');
  }

  clearFormatting() {
    this.exec('removeFormat');
    this.exec('formatBlock', 'p');
  }

  updateContent() {
    this.content = this.editorRef.nativeElement.innerHTML;
    this.onChange(this.content);
  }

  onBlur() {
    this.onTouched();
  }
}