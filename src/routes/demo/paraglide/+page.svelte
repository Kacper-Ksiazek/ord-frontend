<script lang="ts">
import { m } from '$lib/paraglide/messages.js';
import { setLocale } from '$lib/paraglide/runtime';
</script>

{m["auth.login.title"]()}

	<div>
		<button onclick={() => setLocale("en")}>en</button>
		<button onclick={() => setLocale("pl")}>pl</button>
		<button onclick={() => setLocale("de")}>de</button>
	</div>
<p>
  If you use VSCode, install the <a
    href="https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension"
    target="_blank">Sherlock i18n extension</a
  > for a better i18n experience.
</p>
