import { browser } from '$app/environment';
import { getStorageItem, setStorageItem } from '$lib/utils/local-storage';

const HOME_SKELETON_PREVIEW_STORAGE_KEY = 'home_dev_skeleton_preview';

function readPreview(): boolean {
	if (!import.meta.env.DEV || !browser) {
		return false;
	}

	return getStorageItem<boolean>(HOME_SKELETON_PREVIEW_STORAGE_KEY) ?? false;
}

class HomeSkeletonPreviewDev {
	preview = $state(readPreview());

	setPreview(value: boolean) {
		if (!import.meta.env.DEV) {
			return;
		}

		this.preview = value;

		if (browser) {
			setStorageItem(HOME_SKELETON_PREVIEW_STORAGE_KEY, value);
		}
	}

	toggle() {
		this.setPreview(!this.preview);
	}
}

export const homeSkeletonPreviewDev = new HomeSkeletonPreviewDev();
