import { App } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
    GraphicComponent,
} from 'echarts/components';
import Chart from './chart/index.vue';
import Breadcrumb from './breadcrumb/index.vue';
import ProTable from './ProTable/index.vue';
import ProForm from './ProTable/form.vue';
import Editor from './Editor/index.vue';
import Upload from './Upload/index.vue';

// Manually introduce ECharts modules to reduce packing size

use([
    CanvasRenderer,
    BarChart,
    LineChart,
    PieChart,
    RadarChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
    GraphicComponent,
]);

export default {
    install(Vue: App) {
        Vue.component('Chart', Chart);
        Vue.component('Breadcrumb', Breadcrumb);
        Vue.component('ProTable', ProTable);
        Vue.component('ProForm', ProForm);
        Vue.component('Editor', Editor);
        Vue.component('Upload', Upload);
    },
};
