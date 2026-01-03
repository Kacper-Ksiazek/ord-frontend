export interface Tab {
	id: string | number;
	label: string;
	count?: number;
	disabled?: boolean;
}

export interface TabsProps {
	tabs: Tab[];
	activeTab?: string | number;
	activeColor?: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'orange' | 'gray' | 'primary';
	class?: string;
}
