# Hero Background Images

Add custom hero section background images here for enhanced personalization.

## Files

### hero-bg.jpg (Optional)
Custom hero background image that appears behind all animations.

**Recommended Specifications:**
- Format: JPG, PNG, or WebP
- Aspect Ratio: 16:9 (widescreen)
- Resolution: 1920x1080px or higher
- File Size: Optimized under 1MB
- Recommended: 1920x1080px to 2560x1440px

## How to Use

### Option 1: Add Custom Background Image
1. Prepare your image (see specs above)
2. Name it: `hero-bg.jpg`
3. Place it in this folder
4. Website will automatically use it as hero background

### Option 2: Keep Animated Gradient (Default)
Leave this folder empty to use the professional animated gradient background with all the visual effects (orbs, light rays, particles, etc.).

## Image Tips

### Best Results
- Use high-quality images
- Ensure good contrast for text readability
- Avoid overly busy/distracting images
- Consider using semi-transparent overlays
- Test on mobile devices

### Optimization
1. Use ImageOptim, TinyPNG, or similar tools
2. Target file size: 500KB-1MB
3. Use JPG for photographs
4. Use PNG for graphics
5. Consider WebP for modern browsers

### Design Considerations
- Image should complement church branding
- Avoid conflicting with animation layers
- Keep text readable over background
- Consider using for seasonal themes
- Test color contrast for accessibility

## Technical Integration

The hero background image is automatically detected and applied:
- If `hero-bg.jpg` exists, it displays behind the animations
- If no image, the animated gradient shows (default)
- Animations continue regardless of background
- Responsive on all device sizes

## Examples

### Seasonal Themes
- **Spring:** Flower gardens, blooming trees
- **Summer:** Outdoor church gatherings
- **Fall:** Harvest scenery, autumn colors
- **Winter:** Snow-covered church, winter landscape

### Church-Related
- Church sanctuary interior
- Church exterior/building
- Congregation gathered together
- Baptismal waters
- Beautiful architecture

### Nature-Based
- Sunrise/sunset
- Mountains or forests
- Water/ocean views
- Sky/clouds
- Gardens or parks

## Mobile Considerations

- Image displays at different sizes on mobile
- Ensure important content isn't cut off
- Test on various screen sizes (320px, 768px, 1024px, 1920px)
- Consider mobile performance (file size)

## Accessibility Notes

- Maintain text contrast for readability
- Avoid overly animated backgrounds
- Ensure animated effects don't cause motion sickness
- Test with screen readers

## Reset to Default

To go back to the animated gradient:
1. Delete `hero-bg.jpg` from this folder
2. Refresh website
3. Animated gradient returns automatically

## Format Support

✓ JPG (JPEG) - Best for photos
✓ PNG - Best for graphics/transparency
✓ WebP - Modern format (smaller file size)
✗ GIF - Not recommended
✗ SVG - Not recommended for backgrounds

## Performance Tips

1. **Optimize Before Upload**
   - Use ImageOptim or TinyPNG
   - Compress to < 1MB
   - Maintain good resolution

2. **Format Selection**
   - Use JPG for nature/realistic photos
   - Use PNG for artwork/graphics
   - Use WebP for best compression

3. **Dimensions**
   - Minimum: 1280x720px
   - Recommended: 1920x1080px
   - High-res: 2560x1440px

4. **Testing**
   - Test on desktop (1920px)
   - Test on tablet (768px)
   - Test on mobile (375px)
   - Check page load time

## Troubleshooting

### Image Not Showing
- Verify file is named exactly: `hero-bg.jpg`
- Check file format is supported
- Ensure file is in correct folder
- Clear browser cache (Ctrl+Shift+Delete)

### Image Looks Stretched
- Check aspect ratio is 16:9
- Verify resolution is adequate
- Try different image dimensions

### Text Not Readable
- Choose darker background image
- Add text shadow in CSS
- Use overlay effect
- Adjust color scheme

### Poor Performance
- Reduce file size
- Optimize image compression
- Check browser performance tab
- Reduce resolution if needed

## File Management

```
assets/hero-bg/
├── hero-bg.jpg          (Your custom background)
└── README.md            (This file - instructions)
```

## Seasonal Theme Ideas

### Christmas
- Festive church decorations
- Snow-covered building
- Warm winter lights

### Easter
- Sunrise scene
- Resurrection theme imagery
- Spring flowers

### Thanksgiving
- Harvest imagery
- Church gathering
- Gratitude themes

### Anniversary Specific
- Church milestones
- Congregation photos
- Historical imagery
- Celebration atmosphere

## Best Practices

1. **Choose Meaningful Image**
   - Reflects church values
   - Complements event theme
   - Professional quality

2. **Ensure Readability**
   - Good contrast with text
   - Not overly distracting
   - Accessibility compliant

3. **Optimize for All Devices**
   - Test on mobile/tablet/desktop
   - Verify fast loading
   - Check responsive scaling

4. **Maintain Branding**
   - Consistent with church colors
   - Professional appearance
   - Community appropriate

## FAQ

**Q: Can I use multiple backgrounds?**
A: Currently supports one hero background. For rotation, use CSS animations (advanced).

**Q: What if I want to change it seasonally?**
A: Simply replace the hero-bg.jpg file. Website updates automatically.

**Q: Will animations still show?**
A: Yes! All layer animations display over the background image.

**Q: Does it affect performance?**
A: Minimal impact if properly optimized. Keep file under 1MB.

**Q: Can I revert to default?**
A: Yes, delete hero-bg.jpg and refresh the page.

---

**Last Updated:** August 2, 2026
**Status:** Optional Enhancement
**Recommendation:** Keep default animated gradient for best visual impact, or add custom image for personalization
