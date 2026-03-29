export interface BreadcrumbCrumb {
	label: string;
	icon?: LucideIcon;
	onClick?: () => void;
	href?: string;
}

export interface BreadcrumbProps {
	crumbs: BreadcrumbCrumb[];
	class?: string;
}
