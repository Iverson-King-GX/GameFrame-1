import { IOpenStrategy, strateA } from "./IOpenStrategy";
import { PanelMgr } from "./PanelMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export class IUIBase extends cc.Component {

    protected mSkinPath: string = "";                       //皮肤路径（名称）
    protected mSkin: cc.Node = null;                        //皮肤节点（面板）
    protected mLayer: string = "";                          //层级
    protected mArgs: any[] = [];                            //面板参数
    protected mOpenStrategy: IOpenStrategy = null;          //动画策略
    protected mPanelMgr: PanelMgr = null;                    //面板管理器

    protected isClose: boolean = false;                     //是否已经关闭面板

    /**获取绑定的面板节点 */
    public setSkin(node: cc.Node): void { this.mSkin = node; }
    /**设置绑定的面板节点 */
    public getSkin(): cc.Node { return this.mSkin; }
    /**获取面板所在层级 */
    public getLayer(): string { return this.mLayer; }

    /**初始化动画策略 */
    public initStrategy(): void {
        this.mOpenStrategy = new strateA(this.mSkin);
    }
    /**获取皮肤路径 */
    public getSkinPath(): string {
        return `${GlobalVar.CONST.UI_PATH.PANEL_PATH}${this.mSkinPath}`;
    }
    /**获取皮肤名称 */
    public getSkinName(): string {
        return this.mSkinPath;
    }

    //#region 面板生命周期


    public init(mgr: PanelMgr, params?: any[]): void {
        this.mPanelMgr = mgr;
        if (!!params) {
            this.mArgs = params;
        }
    }
    /**初始化组件、节点 */
    protected initComponent(): void {

    }
    /**对外开放接口 */
    public open(): void {
        this.onShowing();
        this.playPanelAudio();
    }
    protected onShowing(): void {
        this.mOpenStrategy.open(this.onShowed.bind(this));
    }
    protected onShowed(): void {

    }
    public panelUpdate(): void { }
    /**对外开放接口 */
    public close(cb: Function): void {
        this.onClosing(cb);
        this.playCloseAudio();
    }
    protected onClosing(cb: Function): void {
        this.mOpenStrategy.close(() => { cb(); this.onClosed(); });
    }
    protected onClosed(): void {

    }

    //#endregion

    protected playPanelAudio(): void {

    }
    protected playCloseAudio(): void {

    }

    //#region 事件
    protected onEvent(): void { }
    protected offEvent(): void { }
    //#endregion

    protected onClose(): void {
        if (this.isClose) return;
        if (this.mPanelMgr == null) return;
        this.isClose = true;
        this.mPanelMgr.closePanel(this.getSkinName());
    }

    onDestroy(): void {
        this.offEvent();
    }
}

export class LoadPanel extends IUIBase {

    private bar: cc.Sprite = null;

    public init(mgr: PanelMgr, params?: any[]): void {
        super.init(mgr, params);
        this.mSkinPath = "LoadPanel";
        this.mLayer = GlobalVar.CONST.ENUM.PANEL_LAYER.funcLayer;
    }

    protected onShowed(): void {
        super.onShowed();
        this.initComponent();
    }

    protected initComponent(): void {
        this.bar = cc.find("pro_frame/bar", this.mSkin).getComponent(cc.Sprite);

        this.onEvent();
    }

    private onProgress(completeCount: number, totalCount: number): void {
        this.bar.fillRange = completeCount / totalCount;
    }

    protected onEvent(): void {
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.loadProgress, this.onProgress.bind(this), "LoadPanel");
    }
    protected offEvent(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.loadProgress, "LoadPanel");
    }

}
