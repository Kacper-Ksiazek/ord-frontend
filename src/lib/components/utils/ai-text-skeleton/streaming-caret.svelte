<!-- Blinking caret appended to text while it is still streaming in. -->
<span class="streaming-caret" aria-hidden="true"></span>

<style>
	.streaming-caret {
		display: inline-block;
		width: 0.5em;
		height: 1em;
		margin-left: 0.15em;
		vertical-align: -0.12em;
		border-radius: 2px;
		background: color-mix(in srgb, var(--color-ink) 55%, transparent);
		animation: streaming-caret-blink 1s steps(2, start) infinite;
	}

	@keyframes streaming-caret-blink {
		to {
			visibility: hidden;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.streaming-caret {
			animation: none;
		}
	}
</style>
