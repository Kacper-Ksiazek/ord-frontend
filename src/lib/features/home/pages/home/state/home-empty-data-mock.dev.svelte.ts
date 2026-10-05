import { browser } from '$app/environment';
import { getStorageItem, setStorageItem } from '$lib/utils/local-storage';

const HOME_EMPTY_DATA_MOCK_STORAGE_KEY = 'home_dev_empty_data_mock';

function readMockEmpty(): boolean {
	if (!import.meta.env.DEV || !browser) {
		return false;
	}

	return getStorageItem<boolean>(HOME_EMPTY_DATA_MOCK_STORAGE_KEY) ?? false;
}

class HomeEmptyDataMockDev {
	mockEmpty = $state(readMockEmpty());

	setMockEmpty(value: boolean) {
		if (!import.meta.env.DEV) {
			return;
		}

		this.mockEmpty = value;

		if (browser) {
			setStorageItem(HOME_EMPTY_DATA_MOCK_STORAGE_KEY, value);
		}
	}

	toggle() {
		this.setMockEmpty(!this.mockEmpty);
	}
}

export const homeEmptyDataMockDev = new HomeEmptyDataMockDev();
