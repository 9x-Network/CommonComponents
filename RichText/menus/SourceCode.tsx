import type { IButtonMenu, IDomEditor } from '@wangeditor/editor';
import { Input, Modal } from 'antd';

const icon = `<svg viewBox="0 0 1024 1024"><path d="M516.571429 696c0 5.028571 3.885714 9.142857 8.571428 9.142857h211.428572c4.685714 0 8.571429-4.114286 8.571428-9.142857v-54.857143c0-5.028571-3.885714-9.142857-8.571428-9.142857h-211.428572c-4.685714 0-8.571429 4.114286-8.571428 9.142857v54.857143z m-222.742858 6.971429l219.428572-184c4.342857-3.657143 4.342857-10.4 0-14.057143l-219.428572-183.885715A9.085714 9.085714 0 0 0 278.857143 328v71.657143c0 2.742857 1.142857 5.257143 3.314286 6.971428L407.657143 512l-125.485714 105.371429a9.257143 9.257143 0 0 0-3.314286 6.971428V696c0 7.771429 9.028571 12 14.971428 6.971429zM932.571429 54.857143H91.428571c-20.228571 0-36.571429 16.342857-36.571428 36.571428v841.142858c0 20.228571 16.342857 36.571429 36.571428 36.571428h841.142858c20.228571 0 36.571429-16.342857 36.571428-36.571428V91.428571c0-20.228571-16.342857-36.571429-36.571428-36.571428z m-45.714286 832H137.142857V137.142857h749.714286v749.714286z" p-id="3500"></path></svg>`;

class SourceCode implements IButtonMenu {
    // TS 语法

    title: string = '📝';
    iconSvg?: string = icon;
    hotkey?: string;
    alwaysEnable?: boolean = true;
    tag: string = 'button';
    width?: number;

    // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
    getValue(): string | boolean {
        return false;
    }

    // 菜单是否需要激活，用不到则返回 false
    isActive(): boolean {
        return false;
    }

    // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
    isDisabled(editor: IDomEditor): boolean {
        return editor.isDisabled();
    }

    // 点击菜单时触发的函数
    exec(editor: IDomEditor) {
        if (this.isDisabled(editor)) return;
        let inputValue: string | null = null;
        Modal.confirm({
            icon: null,
            width: '80%',
            content: (
                <div>
                    <Input.TextArea
                        defaultValue={editor.getHtml()}
                        style={{ height: 600 }}
                        onChange={(e) => {
                            inputValue = e.target.value;
                        }}
                    />
                </div>
            ),
            onOk: () => {
                if (inputValue !== null) editor.setHtml(inputValue);
            },
        });
    }
}

export default SourceCode;
