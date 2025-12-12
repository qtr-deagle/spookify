# 🏗️ Subscription Architecture

## Component Structure

```
┌─────────────────────────────────────────────────────────┐
│                     APP ROOT                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐      ┌──────────────────────┐    │
│  │   Navbar         │      │   Sidebar            │    │
│  ├──────────────────┤      ├──────────────────────┤    │
│  │ [⚡ Upgrade]     │──┐   │ [⚡ Upgrade to PM]   │    │
│  │ [Profile Avatar] │  │   │                      │    │
│  │  with badge      │  │   │ Playlists            │    │
│  └──────────────────┘  │   └──────────────────────┘    │
│                        │                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │          MainContent (Router)                   │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ if (view === 'pricing') → <Pricing />           │   │
│  │ if (view === 'song-detail') → <SongDetail />    │   │
│  │ if (view === 'browse') → <Explore />            │   │
│  │ else → Home, Library, etc.                      │   │
│  └─────────────────────────────────────────────────┘   │
│                        │                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Explore.tsx (when browse view)          │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Moods & Genres                                   │  │
│  │ ┌──────────────────────────────────────────┐   │  │
│  │ │ Premium CTA Section <PremiumCTA />       │   │  │
│  │ │ "Upgrade to Premium" with View Plans btn │   │  │
│  │ └──────────────────────────────────────────┘   │  │
│  │ Trending & Genres                              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Subscription Modal & Pricing                │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ <SubscriptionModal /> - Plan selector            │  │
│  │ <Pricing /> - Full pricing page                  │  │
│  │ Both shown when triggered                        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Context & State Flow

```
                    MusicContext
                         │
         ┌───────────────┼───────────────┐
         │               │               │
      User State    currentView        Songs
      (with sub)      │
         │            ├─ "home"
         │            ├─ "library"
         │            ├─ "browse"
         │            ├─ "song-detail"
         │            └─ "pricing" ← NEW
         │
    subscription:
    "free" | "premium" | "pro"
         │
         └─→ Updates all UI
              elements with
              subscription info
```

## Data Model

```typescript
// User with subscription
interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  subscription?: "free" | "premium" | "pro";  // ← NEW
  subscriptionDate?: string;                    // ← NEW
}

// Context type extension
interface MusicContextType {
  // ... existing properties
  currentView: "home" | "library" | "browse" | 
              "song-detail" | "pricing";         // ← NEW
  // ... setter functions
}
```

## Component Lifecycle

### When User Clicks Upgrade Button

```
Click [⚡ Upgrade]
    ↓
SubscriptionModal Opens
    ↓
User Selects Plan
    ↓
handleSelectPlan(planId)
    ├─ Check if user logged in
    ├─ Simulate payment (1.5s delay)
    ├─ Update user.subscription
    ├─ Call setUser(updatedUser)
    ├─ Show success toast
    └─ Close modal after 1s
         ↓
MusicContext Updates
    ├─ ProfileAvatar badge updates
    ├─ Navbar upgrade button hides
    ├─ Sidebar upgrade button hides
    └─ Explore CTA section hides
```

### When User Accesses Pricing Page

```
Click [View Plans] or setCurrentView("pricing")
    ↓
MainContent Routes to <Pricing />
    ↓
Shows:
├─ 3 Plan Cards
├─ Feature Comparison Table
├─ FAQ Section
└─ CTA Footer
    ↓
User Clicks Upgrade
    ↓
Opens SubscriptionModal
    ↓
(Same flow as above)
```

## Styling Architecture

```
colors/
├─ Primary Orange
│  ├─ from-orange-500 (#f97316)
│  ├─ to-amber-500 (#f59e0b)
│  └─ text-orange-400 (#fb923c)
│
├─ Light Overlays
│  ├─ from-orange-500/10
│  ├─ from-orange-500/20
│  └─ from-orange-500/30
│
├─ Hover States
│  ├─ hover:from-orange-600
│  ├─ hover:to-amber-600
│  └─ hover:opacity-60
│
└─ Borders & Accents
   ├─ border-orange-500/20
   ├─ border-orange-500/30
   ├─ border-orange-500/50
   └─ shadow-orange-500/20
```

## File Organization

```
src/components/
├─ Navbar.tsx                  (Updated)
├─ Sidebar.tsx                 (Updated)
├─ ProfileAvatar.tsx           (Updated)
├─ MainContent.tsx             (Updated)
├─ Explore.tsx                 (Updated)
├─ SongDetail.tsx
├─ Library.tsx
├─ SubscriptionModal.tsx       (NEW)
├─ Pricing.tsx                 (NEW)
└─ ui/                         (Unchanged)

src/context/
└─ MusicContext.tsx            (Updated)

src/types/
└─ music.ts                    (Updated)

docs/
├─ SUBSCRIPTION_FEATURE.md
├─ SUBSCRIPTION_UI_GUIDE.md
├─ SUBSCRIPTION_IMPLEMENTATION_SUMMARY.md
└─ SUBSCRIPTION_QUICK_START.md
```

## Performance Considerations

### Optimizations Applied
- ✅ Modals use portal rendering (default for Dialog)
- ✅ SVG icons cached by lucide-react
- ✅ Toast notifications async
- ✅ Lazy subscription badge rendering in avatar
- ✅ CSS gradients hardware-accelerated

### Future Optimizations
- Consider lazy loading Pricing component
- Memoize plan cards to prevent re-renders
- Cache subscription data in localStorage
- Debounce view changes

## Error Handling

```typescript
handleSelectPlan(planId)
  ├─ Check user exists
  │  └─ Show error toast if not logged in
  ├─ Simulate payment
  │  └─ Show success toast
  └─ Update context
     └─ Automatic UI updates
```

## Testing Recommendations

1. **Unit Tests**
   - Test plan selection logic
   - Test context updates
   - Test conditional rendering

2. **Integration Tests**
   - Test navigation flow
   - Test modal interactions
   - Test badge display

3. **Visual Tests**
   - Test orange color consistency
   - Test responsive layouts
   - Test hover states

## Security Notes

⚠️ **Current Implementation**: Simulates payment (for demo)

When integrating with real payment processor:
- Validate subscription server-side
- Never trust client-side subscription state alone
- Use secure payment tokens
- Implement proper error handling
- Add PCI compliance measures
