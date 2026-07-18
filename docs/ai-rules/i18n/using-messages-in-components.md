# Use Paraglide message functions via `$lib/paraglide/messages`

Import all messages as `m` from `$lib/paraglide/messages.js` and call them as functions using bracket notation with the full dot-notation key: `m['auth.login.title']()`. Pass interpolation parameters as an object argument. Never hardcode user-facing strings in components; for locale reading/switching use `getLocale`/`setLocale` from `$lib/paraglide/runtime`.

## Good

```ts
// login.screen.svelte
import * as m from '$lib/paraglide/messages.js';

const title = m['auth.login.title']();
const subtitle = m['auth.login.otp_subtitle']({ email });
const indicator = m['components.utils.multi-step-form.step_indicator']({ current, total });
```

## Bad

```ts
// Hardcoded string instead of a message function
const title = 'Sign In';

// Wrong import path (old/incorrect output location)
import * as m from '$paraglide/messages';

// Treating the message as a value instead of calling the function
const subtitle = m['auth.login.otp_subtitle'];
```
