export interface BankGroupCompact {
	name: string;
	color: string;
}

export interface BankListItem {
	id: string;
	name: string;
	bankGroup?: BankGroupCompact | null;
}
