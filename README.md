# Gigabox Mini

A quick-commerce Android app: browse a product catalogue, add to cart, check out, and watch
the order progress from *Placed* to *Delivered* on a live map.

React Native 0.87 · TypeScript · Redux Toolkit · FlashList · Google Maps

---

## Setup

Requires **Node ≥ 22.11**, JDK 17, and the Android SDK. Android only — iOS is untested.

```bash
npm install
npm start                 # terminal 1: Metro
npm run android           # terminal 2: build + install
```

### Google Maps key

The order tracking map needs a Google Maps key in `src/config/apiConfig.ts` with two APIs
enabled in Google Cloud Console:

- **Maps JavaScript API** — renders the map
- **Directions API** — the delivery route

Geocoding API is *not* required. Without a key the map area stays blank; the rest of the app
works.

### If the build fails

**`A problem occurred starting process 'command node'`** — the Gradle daemon can't see Node.
Common with nvm, because the long-running daemon keeps a stale PATH:

```bash
cd android && ./gradlew --stop && cd ..
npm run android
```

**`project ':some-library' does not exist`** after removing a dependency — Gradle caches the
autolinking list:

```bash
rm -rf android/build/generated/autolinking
cd android && ./gradlew clean && cd ..
```

### Release APK (for sharing a demo)

```bash
cd android && ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

Self-contained, no Metro needed. Signed with the debug keystore — fine for a demo, not
publishable. **Test the release build specifically**: Android blocks cleartext HTTP in release
only, so anything loading over `http://` works in debug and silently fails in release.

---

## Architecture

```
src/
  api/          dummyjson.com client (axios, AbortController for search cancellation)
  components/   Button, Header, MapView, OrderSuccessModal
  hooks/        useProducts (catalogue + pagination), useProductDetails (one product)
  navigation/   RootNavigator — bottom tabs, each wrapping a stack
  screens/      one folder per screen, each with its own .styles.ts
  services/     notifications (Notifee)
  store/        Redux Toolkit: slices + listener middleware
  utils/        colors, price
```

### State

Redux Toolkit. Four slices — `products`, `cart`, `orders`, `user`.

Cross-cutting behaviour lives in **listener middleware** rather than in screens, so it keeps
working regardless of which screen is mounted:

| Middleware | Responsibility |
|---|---|
| `orderProgress` | Advances an order Placed → Packed → Out for delivery → Delivered on a timer |
| `orderPersistence` | Writes orders to AsyncStorage on every change |
| `userPersistence` | Writes the profile when edited |
| `orderNotifications` | Schedules the three delivery notifications |

### Order lifecycle — derived, not stored

An order stores exactly one time value: `placedAt`. Its status is *computed* from elapsed
time (`statusForElapsed`), never trusted from storage.

That means closing the app is safe. Reopen after ten minutes and the order shows *Delivered*
immediately — no timer had to survive, because the answer comes from the clock. Timers are
then re-armed only for orders genuinely still in flight.

The map is a **display** of this state, not the driver of it. It reads a `phase` prop and
animates; it has no say in when an order completes.

### The map

`MapView` is a WebView hosting the Google Maps JS SDK. It draws the real driving route from
the Directions API, decodes each step's polyline so the scooter follows the road rather than
cutting corners, and fills a green trail behind it.

Phase changes are pushed into the running page with `injectJavaScript`, **not** by rebuilding
the HTML. Rebuilding reloads the page — which previously destroyed the animation and re-billed
a Directions request on every status change.

### Single-source rules

Three bugs in this codebase came from the same cause: one number computed in two places, then
drifting apart. Each is now computed once:

- `utils/price.ts` — discount, delivery fee, order total (the cart and checkout used to quote
  different totals)
- `ordersSlice` timing constants — the status timers, the map animation and the ETA label all
  read the same figures

---

## Assumptions

- **Android only.** iOS is untested and the podfile hasn't been exercised.
- **No backend.** Products come from the public dummyjson.com API; orders exist only on device.
- **Store and delivery locations are hardcoded** in `OrderDetailScreen`. Every order draws the
  same route, regardless of the customer address on the order.
- **The delivery is simulated.** Nothing tracks a real rider; the bike animates over a fixed
  duration.
- **Single user, no auth.** The profile is seeded and editable, but there's no login.
- **Timings are demo-length** — 30s / 15s / 60s rather than realistic ones.

---

## What I'd do next

**Correctness first**

- Type the navigators. Every screen currently declares `route: any; navigation: any`, which is
  how two real bugs reached the device — a wrong screen name and a mistyped param.
- Stock ceiling in the cart. Repeated adds can exceed available stock.
- Handle Directions failures. A non-OK response leaves the map stuck on "Loading route…".

**Then**

- Move the 400-line HTML string out of `MapView.tsx` into its own file. Nothing typechecks
  inside a template literal, and a stray character there is invisible until runtime.
- Replace placeholder data presented as real: the "confirmation email sent" message, the
  hardcoded estimated-delivery date, and the two seed orders that open showing "N/A".
- Notifications currently arrive when the app reopens rather than while it's closed, because
  Notifee defaults to WorkManager, which batches deferred work. Switching to AlarmManager
  helps; surviving a force-stop needs server-sent push.
- Consolidate styles — 1,400 lines with `container` defined eight times.

---

## AI tools

Built with **Claude Code** (Anthropic) used as a pair programmer throughout — most of the
implementation, debugging and review in this repo came out of that collaboration.

**Where it was most useful**

- *Reading library source instead of relying on memory.* Several bugs were only solvable by
  checking what the installed version actually does. The FlashList blank-cell bug was found in
  `ViewHolder.tsx`, where `renderItem` is compared by identity — so an inline arrow function
  re-renders every cell. A `StyleSheet.create<T>` type error turned out to be React Native
  changing its own type definition between versions. Timers silently not firing was RTK
  aborting forked tasks unless `autoJoin: true` is set — visible only in the middleware source.
- *Verifying claims rather than asserting them.* Route distances were checked against the live
  Directions API; the order-status timeline was compiled and executed against its boundaries;
  the middleware was run in a scratch store to prove statuses actually advanced.
- *Parallel code review.* Three reviewers over correctness, React/React Native, and edge cases.
  That surfaced the cart/checkout total mismatch, the product-detail screen wiping the
  catalogue, and a release-only bug where map markers loaded over `http://`.

**Where it needed correcting**

- The Android tab bar took three attempts; the first two diagnoses were wrong.
- It introduced bugs of its own — a `useState` initialiser that only ran for the first order,
  and the RTK fork issue above.
- One reviewer overstated a finding (claiming an error persisted "forever" when every thunk
  clears it); checking the code before reporting caught it.

The practical lesson: it's strongest when asked to *verify* rather than *recall*, and its
output needs running before being believed. Almost everything here was typecheck-verified but
only a subset was confirmed on a device — and the device is what found the remaining problems.
