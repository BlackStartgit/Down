import { Observable } from '@nativescript/core';
import { Canvas } from 'nativescript-canvas-plugin';
import { DiaryEntry } from '../models/diary-entry';
import { FileService } from '../services/file-service';
import { DiaryService } from '../services/diary-service';

export class MainViewModel extends Observable {
    private _entries: Array<DiaryEntry> = [];
    private _savedFiles: Array<{ name: string }> = [];
    private _selectedTab: number = 0;
    private _canvas: Canvas;

    constructor() {
        super();
        this.loadEntries();
        this.loadFiles();
    }

    get entries(): Array<DiaryEntry> {
        return this._entries;
    }

    get savedFiles(): Array<{ name: string }> {
        return this._savedFiles;
    }

    get selectedTab(): number {
        return this._selectedTab;
    }

    set selectedTab(value: number) {
        if (this._selectedTab !== value) {
            this._selectedTab = value;
            this.notifyPropertyChange('selectedTab', value);
        }
    }

    onNewEntry() {
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            title: 'New Entry',
            content: ''
        };
        this._entries.unshift(newEntry);
        DiaryService.saveEntries(this._entries);
        this.notifyPropertyChange('entries', this._entries);
    }

    onDraw(args: any) {
        this._canvas = args.object;
        const context = this._canvas.getContext('2d');
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';
    }

    clearCanvas() {
        if (this._canvas) {
            const context = this._canvas.getContext('2d');
            context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }

    async saveDrawing() {
        if (this._canvas) {
            try {
                const base64String = await this._canvas.toDataURL('image/png');
                await FileService.saveDrawing(base64String);
                this.loadFiles();
            } catch (error) {
                console.error('Error saving drawing:', error);
            }
        }
    }

    async onDeleteFile(args: any) {
        const file = this._savedFiles[args.index];
        try {
            await FileService.deleteFile(file.name);
            this._savedFiles.splice(args.index, 1);
            this.notifyPropertyChange('savedFiles', this._savedFiles);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }

    private loadEntries() {
        this._entries = DiaryService.loadEntries();
        this.notifyPropertyChange('entries', this._entries);
    }

    private loadFiles() {
        this._savedFiles = FileService.getDrawings();
        this.notifyPropertyChange('savedFiles', this._savedFiles);
    }
}