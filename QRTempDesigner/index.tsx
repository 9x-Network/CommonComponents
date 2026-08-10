import type { fabric } from '@/components/common/QRTempDesigner/fabric/fabric';
import { QRTempDesignerProps } from '@/components/common/QRTempDesigner/main';
import { Spin } from 'antd';
import React, { lazy, Suspense } from 'react';

// 由于这个组件依赖包有点大，所以懒加载
const Component = lazy(() => import(/* webpackChunkName: "c__qr_temp_designer" */ './main'));

export default React.forwardRef<fabric.Canvas, QRTempDesignerProps>((props, ref) => (
    <Suspense fallback={<Spin />}>
        <Component {...props} ref={ref} />
    </Suspense>
));
