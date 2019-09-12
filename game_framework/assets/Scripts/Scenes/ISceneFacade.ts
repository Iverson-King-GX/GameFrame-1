import { ISystem } from "../Systems/ISystem";
import { LoadUISystem, MainUISystem } from "../Systems/UISystem/IUISystem";
import { ISceneState } from "./ISceneState";

/**每个场景拥有一个 SceneFacade
 * 用来统一管理子系统，向客户端供高级接口
 */
export class ISceneFacade {
    protected mSceneState: ISceneState = null;
    //系统
    protected mUISystem: ISystem = null;

    public setState(sceneState: any): void {
        if (this.mSceneState == null) return;
        this.mSceneState.setState(sceneState);
    }
    public initSys(ss: ISceneState): void {
        this.mSceneState = ss;
    }
    public rendererUpdate(dt): void {
        this.mUISystem.rendererUpdate(dt);
    }
    public logicUpdate(dt): void {
        this.mUISystem.logicUpdate(dt);
    }
    public endSys(): void {
        this.mUISystem.endSys();
    }

}

export class LoadFacade extends ISceneFacade {
    public initSys(ss: ISceneState): void {
        super.initSys(ss);
        this.mUISystem = new LoadUISystem();
        this.mUISystem.initSys(this);
    }
}

export class MainFacade extends ISceneFacade {
    public initSys(ss: ISceneState): void {
        super.initSys(ss);
        this.mUISystem = new MainUISystem();
        this.mUISystem.initSys(this);
    }
}
