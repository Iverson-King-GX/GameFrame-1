import { ISystem } from "../ISystem";
import { PanelMgr } from "./PanelMgr";
import { IUIBase, LoadPanel } from "./IUIBase";
import { ISceneFacade } from "../../Scenes/ISceneFacade";
import { MainScene } from "../../Scenes/ISceneState";

export class IUISystem extends ISystem {
    protected mPanelMgr: PanelMgr = null;             //面板管理器
    protected mUIRoot: cc.Node = null;                //ui根节点

    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);
        this.mUIRoot = cc.find(GlobalVar.CONST.UI_PATH.UI_ROOT_PATH);
        if (this.mUIRoot == null) return;

        this.mPanelMgr = new PanelMgr();
        this.mPanelMgr.initSys(this.mUIRoot);

        this.initComponents();
        this.onEvent();
    }

    protected initComponents(): void {

    }

    //#region 事件
    protected onEvent(): void {
    }
    protected offEvent(): void {
    }

    //#endregion

    public waitOpenPanel<T extends IUIBase>(panelType: new () => T, name: string, args?: any[]): void {
        this.mPanelMgr.waitOpenPanel(panelType, name, args);
    }
    public openPanel<T extends IUIBase>(panelType: new () => T, name: string, args?: any[]): void {
        this.mPanelMgr.openPanel(panelType, name, args);
    }
    public closePanel(name: string): void {
        this.mPanelMgr.closePanel(name);
    }

    public endSys(): void {
        super.endSys();
        this.offEvent();
    }
}

export class LoadUISystem extends IUISystem {
    private testBtn: cc.Node = null;

    protected initComponents(): void {
        if (this.mUIRoot == null) return;
        super.initComponents();

        this.testBtn = cc.find("viewLayer/test_btn", this.mUIRoot);
    }

    protected onEvent(): void {
        this.testBtn.on("touchend", this.onChangeScene, this);
    }
    protected offEvent(): void {
        this.testBtn.off("touchend", this.onChangeScene, this);
    }
    private onChangeScene(): void {
        this.openPanel(LoadPanel, "LoadPanel");
        this.mFacade.setState(MainScene);
    }
}
export class MainUISystem extends IUISystem {

}
