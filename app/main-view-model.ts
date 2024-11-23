import { Observable, File, knownFolders, path } from '@nativescript/core';
import { Canvas } from 'nativescript-canvas-plugin';

export class MainViewModel extends Observable {
    private _entries: Array<DiaryEntry> = [];
    private _savedFiles: Array<FileItem> = [];
    private _selectedTab: number = 0;
    private _canvas: Canvas;
    private _currentPath: any[] = [];

    constructor() {
        super();
        this.loadEntries();
        this.loadFiles();
    }

    get entries(): Array<DiaryEntry> {
        return this._entries;
    }

    get savedFiles(): Array<FileItem> {
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
        this.saveEntries();
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

    saveDrawing() {
        if (this._canvas) {
            const documentsFolder = knownFolders.documents();
            const fileName = `drawing_${Date.now()}.png`;
            const filePath = path.join(documentsFolder.path, fileName);
            
            this._canvas.toDataURL('image/png')
                .then((base64String) => {
                    const imageData = base64String.replace(/^data:image\/png;base64,/, '');
                    const file = File.fromPath(filePath);
                    file.writeSync(imageData, err => {
                        if (err) {
                            console.error('Error saving drawing:', err);
                        } else {
                            this.loadFiles();
                        }
                    });
                });
        }
    }

    onDeleteFile(args: any) {
        const file = this._savedFiles[args.index];
        const filePath = path.join(knownFolders.documents().path, file.name);
        File.fromPath(filePath).remove()
            .then(() => {
                this._savedFiles.splice(args.index, 1);
                this.notifyPropertyChange('savedFiles', this._savedFiles);
            })
            .catch(err => console.error('Error deleting file:', err));
    }

    private loadEntries() {
        const documentsFolder = knownFolders.documents();
        const filePath = path.join(documentsFolder.path, 'diary_entries.json');
        
        try {
            const file = File.fromPath(filePath);
            const content = file.readTextSync();
            this._entries = JSON.parse(content);
        } catch {
            this._entries = [];
        }
        
        this.notifyPropertyChange('entries', this._entries);
    }

    private saveEntries() {
        const documentsFolder = knownFolders.documents();
        const filePath = path.join(documentsFolder.path, 'diary_entries.json');
        const file = File.fromPath(filePath);
        file.writeTextSync(JSON.stringify(this._entries));
    }

    private loadFiles() {
        const documentsFolder = knownFolders.documents();
        this._savedFiles = documentsFolder.getEntities()
            .filter(entity => entity.name.startsWith('drawing_'))
            .map(entity => ({ name: entity.name }));
        this.notifyPropertyChange('savedFiles', this._savedFiles);
    }
}

interface DiaryEntry {
    id: number;
    date: string;
    title: string;
    content: string;
}

interface FileItem {
    name: string;
}