import { SceneController } from "./SceneController";
import { ISceneFacade, LoadFacade, MainFacade } from "./ISceneFacade";

export class ISceneState {
    protected mName: string = "";
    protected mResArr: Array<string> = null;
    protected mSceneCtrl: SceneController = null;
    protected mFacade: ISceneFacade = null;
    public getSceneName(): string {
        return this.mName;
    }

    constructor(sceneCtrl: SceneController, name: string) {
        this.mSceneCtrl = sceneCtrl;
        this.mName = name;
    }
    public setState(sceneState: any): void {
        if (this.mSceneCtrl == null) return;
        let ss: ISceneState = <ISceneState>new sceneState(this.mSceneCtrl);
        this.mSceneCtrl.setState(ss);
    }

    //#region 状态生命周期

    /**状态初始化 */
    public stateStart(): void {

    }
    /**渲染更新 */
    public rendererUpdate(dt): void {
        this.mFacade.rendererUpdate(dt);
    }
    /**逻辑更新 */
    public logicUpdate(dt): void {
        this.mFacade.logicUpdate(dt);
    }
    /**状态结束，释放资源 */
    public stateEnd(): void {
        this.mFacade.endSys();
    }

    /**加载资源 */
    public loadRes(complete: Function) {
        if (this.mResArr === null) { complete(); return; };
        //后面用load管理器代替，可以更加便利地释放不需要的资源
        let han = GlobalVar.GetHandler(() => { complete() });
        GlobalVar.Loader.loadResArray(this.mResArr, han);
    }
    /**加载进度 */
    protected loadPro(completedCount: number, totalCount: number): void {
        //TODO 通知观察者
    }
    //#endregion
}

export class LoadScene extends ISceneState {
    constructor(sceneCtrl: SceneController, name: string = "LoadScene") {
        super(sceneCtrl, name);
    }

    public stateStart(): void {
        super.stateStart();
        this.mFacade = new LoadFacade();
        this.mFacade.initSys(this);
    }
}

export class MainScene extends ISceneState {

    constructor(sceneCtrl: SceneController, name: string = "MainScene") {
        super(sceneCtrl, name);
    }

    public stateStart(): void {
        super.stateStart();
        this.mFacade = new MainFacade();
        this.mFacade.initSys(this);
    }

}
