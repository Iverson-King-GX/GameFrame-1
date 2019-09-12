export class AudioMgr {
    private static inst: AudioMgr;
    private loadingMap: Map<string, boolean>;

    private currMusic: string;
    private currVolume: number;
    private musicId: number;
    private musicVolume: number;
    private musicMute: boolean;

    private soundIds: number[];
    private soundVolume: number;
    private soundMute: boolean;

    private constructor() {
        this.musicId = -1;
        this.soundIds = new Array<number>();
        this.loadingMap = new Map<string, boolean>();
    }
    public static getInst(): AudioMgr {
        if (!this.inst) {
            this.inst = new AudioMgr();
        }
        return this.inst;
    }
    public init(): void { }

    public playMusic(name: string, pVolume: number = 1) {
        if (this.musicId >= 0) {//有背景音乐再播放
            this.stopMusic();
        }
        const path: string = GlobalVar.CONST.AUDIO_PATH.ROOT_PATH + name;
        this.currMusic = name;
        this.currVolume = pVolume;

        if (this.musicMute) {//静音模式
            console.log("music is mute");
            return;
        }

        const volume = pVolume || this.musicVolume;
        const task: AudioPlayTask = { type: AudioType.Music, name, path, volume, loop: true };
        this.loadTask(task);
    }
    public stopMusic(): void {
        if (this.musicId < 0) {//没有正在播放的音乐
            console.log("no music is playing");
            return;
        }
        cc.audioEngine.stop(this.musicId);
        this.musicId = -1;
    }
    public isMusicMute(): boolean {
        return this.musicMute;
    }
    public setMusicMute(isMute: boolean): void {
        this.musicMute = isMute;
        if (this.musicId > 0) {//有正在播放的音频

        }
    }
    public setMusicVolume(volume: number): void {
        this.musicVolume = volume;
        if (this.musicId >= 0) {
            cc.audioEngine.setVolume(this.musicId, volume);
        }
    }
    private loadTask(task: AudioPlayTask): void {
        const path = task.path;
        if (this.loadingMap.get(path)) return;
        this.loadingMap.set(path, true);
        if (task.external) {
            GlobalVar.Loader.loadExternalAsset(
                path,
                GlobalVar.GetHandler(this.onClipLoaded, this, task)
            );
        } else {
            GlobalVar.Loader.loadRes(
                path,
                GlobalVar.GetHandler(this.onClipLoaded, this, task)
            );
        }
    }
    private onClipLoaded(task: AudioPlayTask, clip: cc.AudioClip): void {
        this.loadingMap.delete(task.path);
        if (task.type == AudioType.Music && task.name != this.currMusic) return;
        this.playClip(clip, task.volume, task.loop, task.type, task.cb);
    }
    private playClip(clip: cc.AudioClip, volume: number, loop: boolean, type: AudioType, cb?: any): void {
        let id: number = cc.audioEngine.play(clip, loop, volume);
        if (type == AudioType.Music) {//bgm
            this.musicId = id;
        } else if (type == AudioType.Sound) {//音效
            this.soundIds.push(id);
            cc.audioEngine.setFinishCallback(id, () => {
                this.onSoundFinished(id);
                cb && cb.exec();
            });
        }
    }
    private onSoundFinished(aid: number): void {
        let idx = this.soundIds.findIndex((id) => {//从数组中获取与aid相等的元素的索引值
            return id == aid;
        });
        if (idx != -1) {
            this.soundIds.splice(idx, 1);
        }
    }
    public playSound(name: string, loop = false, pVolume: number = null, cb?: any): void {
        if (this.soundMute) {
            cc.log("sound is mute");
            return;
        }
        const path = GlobalVar.CONST.AUDIO_PATH.ROOT_PATH + name;
        const volume = pVolume || this.soundVolume;
        const task: AudioPlayTask = { type: AudioType.Sound, name, path, volume, loop, cb };
        this.loadTask(task);
    }
    public playExternalSound(path: string, loop = false, pVolume: number = null, cb?: any): void {
        if (this.soundMute) {
            console.log("sound is mute");
            return;
        }
        const volume = pVolume || this.soundVolume;
        const task: AudioPlayTask = { type: AudioType.Sound, name: path, path, volume, loop, external: true, cb };
        this.loadTask(task);
    }
    public getSoundMute(): boolean {
        return this.soundMute;
    }
    public setSoundMute(isMute: boolean) {
        this.soundMute = isMute;
        this.soundIds.forEach(id => {
            if (isMute) {
                cc.audioEngine.pause(id);
            } else {
                cc.audioEngine.resume(id);
            }
        })
    }
    public setSoundVolume(volume: number) {
        this.soundVolume = volume;
        this.soundIds.forEach(id => {
            cc.audioEngine.setVolume(id, volume);
        })
    }
    public stopSound(): void {
        this.soundIds.forEach(id => {
            cc.audioEngine.stop(id);
        });
        this.soundIds.length = 0;
    }
    public clearCache(): void {
        this.stopMusic();
        this.loadingMap.clear();
        cc.audioEngine.uncacheAll();
    }

}
enum AudioType {
    Music = 1,
    Sound = 2
}
interface AudioPlayTask {
    type: AudioType;
    name: string;
    path: string;
    volume: number;
    loop: boolean;
    external?: boolean;
    cb?: any
}
