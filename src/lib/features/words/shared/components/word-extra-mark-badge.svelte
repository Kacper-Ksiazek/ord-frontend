<script lang="ts">
	import { Badge } from '$lib/components/utils/badge';
	import { getWordExtraMarkLabel } from '$words/shared/constants/enum-values';
	import { getWordExtraMarkIcon } from '$words/shared/constants/word-extra-mark-styles';
	import type { WordExtraMark } from '$words/types';

	interface Props {
		mark: WordExtraMark;
	}

	let { mark }: Props = $props();

	const Icon = $derived(getWordExtraMarkIcon(mark));
</script>

<Badge color="gray">
	<Icon class="size-3 shrink-0" aria-hidden="true" />
	{getWordExtraMarkLabel(mark)}
</Badge>
