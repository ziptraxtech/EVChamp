# Scroll-Triggered Reveal Animations

## Overview

This implementation adds smooth, modern scroll-triggered fade-in and slide-up animations to your EV Champ website using the Intersection Observer API. The animations are performance-optimized, trigger only once per scroll, and provide a professional SaaS landing page experience.

## Architecture

### 1. Custom Hook: `useScrollReveal`
**Location:** `src/hooks/useScrollReveal.ts`

The hook uses the Intersection Observer API to:
- Detect when elements enter the viewport
- Trigger animations only once per element
- Unobserve elements after animation to prevent repeated triggers
- Support customizable timing and thresholds

**Key Features:**
- **Threshold:** 0.1 (triggers when 10% of element is visible)
- **Root Margin:** -50px (triggers slightly before element fully enters)
- **Duration:** 700ms (0.6-0.8s as required)
- **Delay:** Configurable per element (staggered animations)
- **Easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out)

**Usage:**
```tsx
const { elementRef, animationStyle, isVisible } = useScrollReveal({
  duration: 700,
  delay: 0,
  threshold: 0.1,
});

return (
  <div ref={elementRef} style={animationStyle}>
    {/* Your content */}
  </div>
);
```

### 2. Wrapper Component: `ScrollReveal`
**Location:** `src/components/ScrollReveal.tsx`

A simple, reusable React component that wraps the hook for easier implementation throughout your app.

**Usage:**
```tsx
<ScrollReveal className="my-section" duration={700} delay={100}>
  <h1>Section Title</h1>
  <p>Section content...</p>
</ScrollReveal>
```

**Props:**
- `children`: ReactNode - The content to animate
- `className`: string - Optional CSS classes for the wrapper div
- `duration`: number - Animation duration in milliseconds (default: 700)
- `delay`: number - Delay before animation starts (default: 0)
- `threshold`: number - Intersection Observer threshold (default: 0.1)

## Implemented Animations

The following sections have been updated with scroll reveal animations:

### 1. **Hero Section** (`src/components/Hero.tsx`)
- Main heading and description fade in + slide up
- CTA button animates with staggered timing
- Hero image and points animate together

### 2. **Overview Section** (`src/Overview.tsx`)
- QR code section slides in from left
- Text content and offerings slide in from right
- Staggered delays for visual rhythm

### 3. **Features Section** (`src/components/Features.tsx`)
- Section heading fades in
- Feature cards animate with 100ms stagger between each (index * 100)
- Creates a cascading reveal effect

### 4. **How It Works Section** (`src/HowItWorks.tsx`)
- Main heading and description animate in
- Three subsections (Smart Charging, AI Guidance, Stay Ahead) each animate on scroll
- Images and text maintain visual balance

### 5. **Coverage Section** (`src/Coverage.tsx`)
- Left content animates in
- Right image animates separately
- Both maintain alignment despite staggered timing

### 6. **Testimonials Section** (`src/Testimonials.tsx`)
- Individual testimonial cards animate with 100ms stagger
- Creates a wave-like reveal effect

## Animation Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Initial Opacity | 0 | Invisible before trigger |
| Final Opacity | 1 | Fully visible after animation |
| Initial Transform | translateY(40px) | Slides up from below |
| Final Transform | translateY(0) | Returns to normal position |
| Duration | 700ms | Professional pace |
| Easing | cubic-bezier(0.25, 0.46, 0.45, 0.94) | Ease-out for natural deceleration |
| Trigger Point | 10% element visible | Smooth, not abrupt |
| Repeat | Once per page load | Automatic Intersection Observer unobserve |
| Stagger Delay | 100ms (optional) | For cascading effects |

## Performance Considerations

✅ **Optimized Implementation:**
- Uses native Intersection Observer API (no external dependencies like GSAP)
- Automatically unobserves elements after animation (no memory leaks)
- CSS transitions for smooth GPU-accelerated animations
- No JavaScript animation loops

✅ **Browser Support:**
- Modern browsers: Chrome, Firefox, Safari, Edge
- Fallback: Elements remain visible if Intersection Observer not supported

## Integration Checklist

- [x] Custom hook created and tested
- [x] ScrollReveal component created
- [x] Hero section updated
- [x] Overview section updated
- [x] Features section updated (with stagger)
- [x] How It Works section updated
- [x] Coverage section updated
- [x] Testimonials section updated
- [x] All animations use consistent timing (700ms ease-out)

## Future Enhancements

### Optional Improvements:
1. **Add GSAP ScrollTrigger** for more advanced animations
   ```bash
   npm install gsap
   ```

2. **Parallax Scrolling** - Different scroll speeds for different elements

3. **Scroll Velocity Animations** - Animation speed based on scroll speed

4. **Mobile-Specific Triggers** - Adjust threshold for mobile devices

5. **Animation Presets**
   ```tsx
   <ScrollReveal preset="slideUp" duration={600}>
   <ScrollReveal preset="fadeIn" duration={500}>
   <ScrollReveal preset="scaleUp" duration={700}>
   ```

6. **Stagger Container Component**
   ```tsx
   <StaggerContainer staggerDelay={100}>
     <ScrollReveal>{item1}</ScrollReveal>
     <ScrollReveal>{item2}</ScrollReveal>
   </StaggerContainer>
   ```

## Troubleshooting

### Animations not triggering:
1. Check browser console for JavaScript errors
2. Verify Intersection Observer is supported
3. Ensure element is in viewport (not hidden by CSS)
4. Check that `ref` is properly attached

### Animations too fast/slow:
- Adjust `duration` prop: 
  - Faster: 400-500ms
  - Slower: 800-1000ms

### Animations repeating:
- Verify hook is using `observer.unobserve(entry.target)`
- Check for duplicate component renders

### Performance issues:
- Reduce number of animated elements on single page
- Increase `threshold` value (higher = later trigger)
- Consider lazy loading components below the fold

## CSS Classes Used

The hook applies inline styles directly, but you can create additional CSS modules:

```css
/* Optional: Add subtle box-shadow animation */
@keyframes shadowPulse {
  0% {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  100% {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}
```

## Testing

To test animations in development:
1. Open DevTools (F12)
2. Scroll down the page and watch elements animate in
3. Hard refresh (Cmd/Ctrl + Shift + R) and scroll again
4. Verify animations trigger only once per reload
5. Check mobile responsiveness in device emulation

---

**Note:** These animations enhance user experience without impacting performance. All timing, opacity, and transform values follow modern SaaS design standards.
