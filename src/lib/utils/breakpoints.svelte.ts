import { MediaQuery } from 'svelte/reactivity';

export const isMobile = new MediaQuery('(max-width: 767px)');
export const isTablet = new MediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const isSmallLaptop = new MediaQuery('(min-width: 1024px) and (max-width: 1366px)');
export const isBigLaptop = new MediaQuery('(min-width: 1367px) and (max-width: 1919px)');
export const isMonitor1920 = new MediaQuery('(min-width: 1920px) and (max-width: 2559px)');
export const isUltrawide = new MediaQuery('(min-width: 2560px)');
