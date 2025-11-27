<script lang="ts">
	interface Props {
		class?: string;
		orientation?: 'horizontal' | 'vertical';
		color?: string;
	}

	let {
		class: customClass = '',
		orientation = 'horizontal',
		color = 'bg-gray-800'
	}: Props = $props();

	const baseClass = orientation === 'horizontal' ? 'h-px w-full my-2' : 'w-px h-full mx-2';
	const classes = `${baseClass} ${color} ${customClass}`;
</script>

<div class={classes}></div>
