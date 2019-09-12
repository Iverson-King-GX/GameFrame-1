import { LoaderMgr, gen_handler } from "./LoaderMgr";
import { EventMgr } from "./EventMgr";
import { AudioMgr } from "./AudioMgr";

window.GlobalVar = {}
GlobalVar.Loader = LoaderMgr.getInst();                     //资源管理器
GlobalVar.EventMgr = EventMgr.getInst();                    //事件管理器
GlobalVar.AudioMgr = AudioMgr.getInst();                    //音频管理器
GlobalVar.GetHandler = gen_handler;                         //用于绑定回调函数this指针
/**常量 */
GlobalVar.CONST = {
    /**事件类型 */
    EVENT: {
        /**开始游戏 */
        gameStart: 1,
        /**加载进度 */
        loadProgress: 2
    },
    /**枚举类型 */
    ENUM: {
        /**面板层级枚举 */
        PANEL_LAYER: {
            /**功能面板层 */
            funcLayer: "funcLayer",
            /**特效层 */
            effLayer: "effLayer",
            /**弹窗层 */
            alertLayer: "alertLayer",
            /**提示层 */
            tipLayer: "tipLayer",
            /**顶层（一般用于全屏覆盖） */
            topLayer: "topLayer"
        }
    },
    /**图片资源路径 and ui根目录*/
    UI_PATH: {
        /**ui根目录 */
        UI_ROOT_PATH: "Canvas/uiRoot",
        /**面板预制资源路径 */
        PANEL_PATH: "prefabs/uiPanels/"
    },
    /**音效资源路径 */
    AUDIO_PATH: {
        ROOT_PATH: "",
        MUSIC: {

        },
        SOUND: {

        }
    }


}