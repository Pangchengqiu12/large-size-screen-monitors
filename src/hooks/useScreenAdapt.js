import { debounce } from '@/utils/utils';
import { onMounted, onUnmounted } from 'vue';
/**
 * @description: 屏幕适配
 * @param {number} dWidth 设计稿宽度
 * @param {number} dHeight 设计稿高度
 */
export default function useScreenAdapt(dWidth = 1920, dHeight = 1080) {
  // 防抖
  const throttleAdjustZoom = debounce(() => {
    AdjustZoom();
  }, 100);

  onMounted(() => {
    AdjustZoom();
    // 响应式
    window.addEventListener('resize', throttleAdjustZoom);
  });

  // 释放资源
  onUnmounted(() => {
    window.removeEventListener('resize', throttleAdjustZoom);
  });

  function AdjustZoom() {
    // 设计稿尺寸及宽高比
    const designWidth = dWidth;
    const designHeight = dHeight;
    const designRatio = designWidth / designHeight; // 1.78

    // 当前屏幕的尺寸及宽高比
    const deviceWidth = document.documentElement.clientWidth;
    const devicHeight = document.documentElement.clientHeight;
    const deviceRatio = deviceWidth / devicHeight;

    // 计算缩放比
    let scaleRatio = 1;
    // 如果当前屏幕的宽高比大于设计稿的，则以高度比作为缩放比
    if (deviceRatio > designRatio) {
      scaleRatio = devicHeight / designHeight;
    } else {
      // 否则以宽度比作为缩放比
      scaleRatio = deviceWidth / designWidth;
    }

    document.body.style.transform = `scale(${scaleRatio}) translateX(-50%)`;
  }
}
