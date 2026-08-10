import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import type { MenuProps } from './index';

const FullScreen = ({ canvas }: MenuProps) => {
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const wrapper = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let parent = canvas.wrapperEl.parentElement;
        while (parent && !parent.className.match('drawingpad-container')) {
            parent = parent.parentElement;
        }
        // @ts-ignore
        wrapper.current = parent;
        const onfullscreenchange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onfullscreenchange);
        return () => {
            document.removeEventListener('fullscreenchange', onfullscreenchange);
        };
    }, []);
    return (
        <div
            className={'drawingpad-menu_act'}
            onClick={() => {
                if (isFullScreen) {
                    document.exitFullscreen();
                } else {
                    wrapper.current?.requestFullscreen();
                }
                setIsFullScreen(!isFullScreen);
            }}
        >
            {isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </div>
    );
};

export default FullScreen;
