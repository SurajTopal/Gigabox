# Performance

What was measured, what changed, and — importantly — what wasn't measured.

---

## Up front: how these were verified

Findings here came from **reading installed library source, inspecting real API responses, and
running the logic in isolation** — not from a profiler. Nothing below is an instrumented
frame-rate or millisecond figure, because none were captured. Where a number appears, the
method that produced it is stated. See *Not measured* at the end.

---

## 1. Blank cells while scrolling the product list

**Symptom:** fast flings left blank regions where cards should be.

Two independent causes, both confirmed in `@shopify/flash-list` 2.3.2's own source.

### Cause A — item memoisation was defeated

`node_modules/@shopify/flash-list/src/recyclerview/ViewHolder.tsx`:

```js
const children = useMemo(() => {
  return renderItem?.({ item, index, extraData, target }) ?? null;
}, [item, extraData, target, renderItem]);        // renderItem is a dependency
```
```js
export const ViewHolder = React.memo(..., (prev, next) =>
  prev.renderItem === next.renderItem && ...)     // and a memo gate
```

`renderItem` is compared **by identity** in both places. It was declared as an inline arrow
function in the list's JSX, so every render produced a new function — invalidating the memo
gate and the `useMemo` for *every mounted cell simultaneously*.

Scrolling triggers `onEndReached` → a Redux update → a re-render → all cells rebuild. The
loop feeds itself.

**Fix:** hoisted `renderItem` into a `useCallback` with stable dependencies, shared by both
the catalogue and search lists.

Also removed `key={item.id}` from inside `renderItem`. FlashList recycles views deliberately;
a React `key` forces unmount/remount on each recycle, defeating the mechanism. Removing it
exposed a latent bug — recycled cards carried the previous product's local state — so card
state now resets when a view is handed a different product.

### Cause B — the draw buffer was smaller than one row

`src/native/config/PlatformHelper.android.ts`:

```ts
defaultDrawDistance: 250,     // dp
```

Measured card row height from `HomeScreen.styles.ts`:

```
imageContainer 140
+ cardContent  (24 padding + ~36 title + ~16 rating + ~20 price + ~36 cart controls)
+ marginVertical 16
≈ 310 dp
```

**250dp of buffer against a 310dp row — less than a single row rendered ahead.** A fling
crosses several rows per frame and outruns it immediately.

**Fix:** `drawDistance={1000}` (~3 rows of runway each direction), and
`onEndReachedThreshold` 0.5 → 1.5 so the next page is requested before the loaded data runs
out too.

**Trade-off, stated plainly:** this renders roughly 16 cells instead of ~6. It buys smoothness
with memory and per-frame work. It is only affordable *because* Cause A was fixed first —
with the inline `renderItem` still in place, a larger buffer would have made things worse.

---

## 2. Images — investigated, no action taken

Suspected as the blank-cell cause. Measured instead of assumed:

```
thumbnail.webp   10,112 bytes over the wire
                 300 × 300 px  (parsed from the WebP VP8X header)
                 0.34 MB decoded (300 × 300 × 4)
displayed at     ~170 × 140 dp
```

On a 3× density screen the display area is ~510 × 420 physical pixels, so a 300×300 source is
**already smaller than its display size**. There is no downsampling win available, and
`resizeMethod="resize"` would achieve nothing.

**Conclusion: images are not a bottleneck here.** Recorded because ruling something out is a
result, and it stopped an optimisation that would have cost effort for zero gain.

---

## 3. Redundant network requests on startup

`useProducts` dispatched `fetchCategories()` on every mount. The category feature had been
removed earlier — nothing read the result.

Worse than waste: `fetchCategories` wrote to the **same `loading` flag** as product
pagination, so its response could clear `loading` while a products request was still in
flight, defeating the guard against duplicate page requests.

**Fix:** removed the call. One fewer request per mount, and pagination's guard now holds.

---

## 4. A screen that discarded the catalogue

`ProductDetailScreen` called `useProducts()` — a hook whose mount effect fetches page 0 of the
whole catalogue and **replaces** the product list.

Opening any product therefore: re-fetched 30 products, threw away every page already
paginated, and lost scroll position — while `currentPage` stayed where it was, permanently
stranding the products in between.

**Fix:** a separate `useProductDetails(productId)` that fetches one product and nothing else.
One change, three problems: no wasted refetch, no lost pages, no lost scroll position.

---

## 5. Pagination that never terminated

`loadMore` ignored `totalProducts`, which the slice already stored. Past the 194th product
(confirmed against the live API), every bounce at the list bottom fired another request
returning an empty array — indefinitely.

**Fix:** `loadMore` returns early when `products.length >= totalProducts`.

---

## 6. Map: reload-per-status-change

The map is a WebView whose HTML is built from props. `phase` was among those props, so every
status change rebuilt the HTML, which replaced the WebView `source` and reloaded the page:
Google Maps SDK re-initialised, a **billed Directions request re-issued**, and a visible white
flash — up to three times per order.

It was also self-defeating: the WebView's "delivered" message triggered the state change that
destroyed the animation which sent it.

**Fix:** `phase` was removed from the HTML's dependencies. Changes are now pushed into the
running page via `injectJavaScript`, and the page updates in place. The page rebuilds only
when the *route itself* changes.

`htmlContent` and the `source` object are both memoised, so unrelated re-renders (a scroll
toggle, a status badge) can't reload the map either.

---

## Known, not yet fixed

- **`OrdersScreen` repeats the `renderItem` mistake** — inline `renderItem` plus inline
  `onPress` defeat `React.memo` on `OrderCard`. With statuses ticking every 15–30 seconds,
  every card re-renders on each tick.
- **`ListFooterComponent={renderFooter}` on the home list** — a function redeclared each render
  is a new component *type*, so React unmounts and remounts that subtree every render.
- **The map animation runs on a hidden screen.** Switching tabs leaves `OrderDetailScreen`
  mounted and its 200ms interval running. Needs a `useIsFocused` gate.
- **Per-card Android compositing.** Each card has `elevation: 2` (its own hardware layer plus a
  shadow pass) and two nested `overflow: 'hidden'` + `borderRadius` clips. With ~16 cards
  alive, that's real GPU work — but flattening it changes the visual design, so it's a
  decision rather than a fix.

---

## Not measured

Stated plainly, because a performance document that implies more rigour than was applied is
worse than one that admits its limits:

- **No frame-rate capture.** No Perfetto/systrace runs; "smoother" here means the identified
  cause was removed, not a measured FPS delta.
- **No startup-time measurement.** TTI was never timed, before or after. Startup now blocks on
  an AsyncStorage read (to avoid rendering a default profile then swapping it), which is
  plausibly a few milliseconds but was not measured.
- **No re-render counts.** The memoisation problems were identified by reading the library's
  comparison logic, not by counting renders in React DevTools.
- **No low-end device testing.** Everything was exercised on an emulator and one physical
  device.
- **Bundle size unexamined.** The release APK is 72MB, which is large; no analysis was done.

The honest summary: the causes were identified precisely and fixed at the root, but the
improvements are **reasoned and verified-by-mechanism rather than benchmarked**. Instrumenting
the before/after would be the first thing to do next.
