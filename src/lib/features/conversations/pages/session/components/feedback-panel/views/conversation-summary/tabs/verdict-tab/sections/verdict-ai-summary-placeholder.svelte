<script lang="ts">
	import { Sparkles } from 'lucide-svelte';
	import { Button } from '$lib/components/buttons/button';
	import { cn } from '$lib/utils/cn';

	/** Placeholder for future AI-generated session summary + actionable CTAs. */
</script>

<section
	class={cn(
		'rounded-[10px] border border-dashed border-line-subtle bg-accent-soft/30 px-4 py-4',
		'flex min-h-0 flex-1 flex-col gap-3'
	)}
	aria-label="Podsumowanie rozmowy — wkrótce"
	data-testid="verdict-ai-summary-placeholder"
>
	<div class="space-y-1">
		<div class="flex items-center gap-1.5 text-sm font-medium text-ink">
			<Sparkles class="size-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
			<h4>Podsumowanie rozmowy</h4>
		</div>
		<p class="text-sm leading-relaxed text-ink-muted">
			Tutaj pojawi się krótkie podsumowanie sesji wygenerowane przez AI — główne wnioski i co warto
			ćwiczyć dalej.
		</p>
	</div>

	<div class="flex flex-wrap gap-2" aria-hidden="true">
		<Button type="OUTLINED" variant="TEXT" disabled class="pointer-events-none opacity-50">
			Sugerowana akcja 1
		</Button>
		<Button type="OUTLINED" variant="TEXT" disabled class="pointer-events-none opacity-50">
			Sugerowana akcja 2
		</Button>
	</div>

	<p class="mt-auto text-xs text-ink-subtle">Funkcja w przygotowaniu.</p>
</section>
