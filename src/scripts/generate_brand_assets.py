import os
import math
from PIL import Image, ImageDraw, ImageFont

# Sampled Brand Constants
NAVY = "#03173B"      # RGB(3, 23, 59)
RED = "#BF1111"       # RGB(191, 17, 17)
BLUE = "#2E8EBF"      # RGB(46, 142, 191)
MARK_STROKE = "#E0E0E0"# RGB(224, 224, 224)
WHITE = "#FFFFFF"

# Circles geometry in 500x500 canvas
RED_CX = 224.5
RED_CY = 199.0
RED_R = 95.5

BLUE_CX = 278.0
BLUE_CY = 255.0
BLUE_R = 88.0

def trace_mask_to_svg_paths(mask_img, epsilon=0.55):
    w, h = mask_img.size
    pixels = [[1 if mask_img.getpixel((x, y)) > 128 else 0 for x in range(w)] for y in range(h)]
    
    dirs = [(1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0), (-1, -1), (0, -1), (1, -1)]
    visited = set()
    contours = []
    
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if pixels[y][x] == 1 and (pixels[y][x-1] == 0 or pixels[y-1][x] == 0 or pixels[y+1][x] == 0 or pixels[y][x+1] == 0):
                if (x, y) not in visited:
                    start = (x, y)
                    curr = start
                    contour = [curr]
                    visited.add(curr)
                    dir_idx = 5
                    
                    steps = 0
                    while steps < 12000:
                        steps += 1
                        found = False
                        for i in range(8):
                            d = (dir_idx + i) % 8
                            nx, ny = curr[0] + dirs[d][0], curr[1] + dirs[d][1]
                            if 0 <= nx < w and 0 <= ny < h and pixels[ny][nx] == 1:
                                curr = (nx, ny)
                                contour.append(curr)
                                visited.add(curr)
                                dir_idx = (d + 5) % 8
                                found = True
                                break
                        if not found or curr == start:
                            break
                    if len(contour) >= 12:
                        contours.append(contour)
                        
    def rdp(points, ep):
        if len(points) < 3:
            return points
        start, end = points[0], points[-1]
        dmax, index = 0, 0
        dx, dy = end[0] - start[0], end[1] - start[1]
        norm = math.hypot(dx, dy)
        for i in range(1, len(points) - 1):
            p = points[i]
            if norm == 0:
                d = math.hypot(p[0] - start[0], p[1] - start[1])
            else:
                d = abs(dy * p[0] - dx * p[1] + end[0] * start[1] - end[1] * start[0]) / norm
            if d > dmax:
                index, dmax = i, d
        if dmax > ep:
            r1 = rdp(points[:index+1], ep)
            r2 = rdp(points[index:], ep)
            return r1[:-1] + r2
        else:
            return [start, end]
            
    path_d_parts = []
    for c in contours:
        simplified = rdp(c, epsilon)
        if len(simplified) < 3:
            continue
        cmds = [f"M {simplified[0][0]:.1f} {simplified[0][1]:.1f}"]
        for pt in simplified[1:]:
            cmds.append(f"L {pt[0]:.1f} {pt[1]:.1f}")
        cmds.append("Z")
        path_d_parts.append(" ".join(cmds))
        
    return " ".join(path_d_parts)

def generate_all_assets():
    out_dir = './pulse/public/brand'
    os.makedirs(out_dir, exist_ok=True)
    
    stroke_mask = Image.open(os.path.join(out_dir, 'stroke_mask.png')).convert('L')
    stroke_d = trace_mask_to_svg_paths(stroke_mask, 0.55)
    
    # Wordmark mask
    wm_mask = Image.open(os.path.join(out_dir, 'wordmark_mask.png')).convert('L')
    wm_d = trace_mask_to_svg_paths(wm_mask, 0.55)
    
    # 1. MARK ONLY (Full Colour, transparent bg, 500x500 viewBox 0 0 500 500)
    mark_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="110 90 270 300" width="100%" height="100%">
  <!-- Red Circle (upper-left, back) -->
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <!-- Blue Circle (lower-right, front) -->
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <!-- Head & Circuit Trace Lines -->
  <path d="{stroke_d}" fill="{MARK_STROKE}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(out_dir, 'mark.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_svg)
        
    # 2. MARK LIGHT (Navy stroke variant for light backgrounds where grey might fade)
    mark_light_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="110 90 270 300" width="100%" height="100%">
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <path d="{stroke_d}" fill="{NAVY}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(out_dir, 'mark-light.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_light_svg)

    # 2b. MARK ON NAVY TILE (Alternative for light theme: mark on rounded navy tile)
    mark_tile_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" rx="60" fill="{NAVY}" />
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <path d="{stroke_d}" fill="{MARK_STROKE}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(out_dir, 'mark-tile.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_tile_svg)

    # 3. MARK ALL-WHITE (Single Colour for navy/dark backgrounds)
    mark_white_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="110 90 270 300" width="100%" height="100%">
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="#FFFFFF" fill-opacity="0.25" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="#FFFFFF" fill-opacity="0.35" />
  <path d="{stroke_d}" fill="#FFFFFF" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(out_dir, 'mark-white.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_white_svg)

    # 4. MARK ALL-NAVY (Single Colour for print, PDFs, and watermarks)
    mark_navy_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="110 90 270 300" width="100%" height="100%">
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{NAVY}" fill-opacity="0.18" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{NAVY}" fill-opacity="0.28" />
  <path d="{stroke_d}" fill="{NAVY}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(out_dir, 'mark-navy.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_navy_svg)

    # 5. STACKED LOCKUP (Full Colour on Navy Background, matching Pulse-.png exactly)
    stacked_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" fill="{NAVY}" />
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <path d="{stroke_d}" fill="{MARK_STROKE}" fill-rule="evenodd" />
  <path d="{wm_d}" fill="{WHITE}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(out_dir, 'stacked.svg'), 'w', encoding='utf-8') as f:
        f.write(stacked_svg)

    # 6. STACKED LOCKUP LIGHT (Transparent/Light bg, Navy wordmark)
    stacked_light_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 80 290 320" width="100%" height="100%">
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <path d="{stroke_d}" fill="{NAVY}" fill-rule="evenodd" />
  <path d="{wm_d}" fill="{NAVY}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(out_dir, 'stacked-light.svg'), 'w', encoding='utf-8') as f:
        f.write(stacked_light_svg)

    # 7. HORIZONTAL LOCKUP (Mark left, Wordmark right for Navbar)
    # Mark in 110..370 (width 260, height 290). Let's transform:
    # Scale mark down to height 48, put at x=0, y=0.
    # Put wordmark at x=60, scaled to height ~32.
    # In 500x500 coordinates, wordmark is width 160, height 54.
    # Let's create clean normalized horizontal SVG with viewBox 0 0 280 64
    horizontal_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="100%" height="100%">
  <!-- Scaled Mark on Left (height 54, width ~48) -->
  <g transform="translate(-18, -14) scale(0.19)">
    <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
    <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
    <path d="{stroke_d}" fill="{MARK_STROKE}" fill-rule="evenodd" />
  </g>
  <!-- Wordmark 'Pulse' on Right -->
  <g transform="translate(-20, -188) scale(0.60)">
    <path d="{wm_d}" fill="{WHITE}" fill-rule="evenodd" />
  </g>
</svg>'''
    with open(os.path.join(out_dir, 'horizontal.svg'), 'w', encoding='utf-8') as f:
        f.write(horizontal_svg)

    # 8. HORIZONTAL LOCKUP FOR LIGHT BACKGROUND (Navy text & stroke)
    horizontal_light_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="100%" height="100%">
  <g transform="translate(-18, -14) scale(0.19)">
    <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
    <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
    <path d="{stroke_d}" fill="{NAVY}" fill-rule="evenodd" />
  </g>
  <g transform="translate(-20, -188) scale(0.60)">
    <path d="{wm_d}" fill="{NAVY}" fill-rule="evenodd" />
  </g>
</svg>'''
    with open(os.path.join(out_dir, 'horizontal-light.svg'), 'w', encoding='utf-8') as f:
        f.write(horizontal_light_svg)

    # 9. HORIZONTAL LOCKUP ALL-NAVY (Single Colour for Print / PDF header)
    horizontal_navy_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="100%" height="100%">
  <g transform="translate(-18, -14) scale(0.19)">
    <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{NAVY}" fill-opacity="0.18" />
    <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{NAVY}" fill-opacity="0.28" />
    <path d="{stroke_d}" fill="{NAVY}" fill-rule="evenodd" />
  </g>
  <g transform="translate(-20, -188) scale(0.60)">
    <path d="{wm_d}" fill="{NAVY}" fill-rule="evenodd" />
  </g>
</svg>'''
    with open(os.path.join(out_dir, 'horizontal-navy.svg'), 'w', encoding='utf-8') as f:
        f.write(horizontal_navy_svg)

    # 10. MOTIF (Two overlapping circles only: red back, blue front)
    motif_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="120 95 250 255" width="100%" height="100%">
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
</svg>'''
    with open(os.path.join(out_dir, 'motif.svg'), 'w', encoding='utf-8') as f:
        f.write(motif_svg)

    # 11. FAVICON SVG
    favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="110 90 270 300">
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <path d="{stroke_d}" fill="{MARK_STROKE}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(out_dir, 'favicon.svg'), 'w', encoding='utf-8') as f:
        f.write(favicon_svg)
    # Also write to public/favicon.svg
    with open('./pulse/public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(favicon_svg)

    # 12. RASTER ICONS GENERATION (from Pulse-.png & Pulse_transparent-.png)
    src_stacked = Image.open(os.path.join(out_dir, 'Pulse-.png')).convert('RGBA')
    src_mark = Image.open(os.path.join(out_dir, 'Pulse_transparent-.png')).convert('RGBA')
    
    # 1x, 2x, 3x for mark (crop tight to mark: 110..370, 90..390)
    mark_cropped = src_mark.crop((115, 95, 375, 395))
    mark_cropped.resize((120, 138), Image.Resampling.LANCZOS).save(os.path.join(out_dir, 'mark-1x.png'))
    mark_cropped.resize((240, 276), Image.Resampling.LANCZOS).save(os.path.join(out_dir, 'mark-2x.png'))
    mark_cropped.resize((360, 414), Image.Resampling.LANCZOS).save(os.path.join(out_dir, 'mark-3x.png'))

    # 1x, 2x, 3x for stacked lockup
    src_stacked.resize((240, 240), Image.Resampling.LANCZOS).save(os.path.join(out_dir, 'logo-stacked-1x.png'))
    src_stacked.resize((480, 480), Image.Resampling.LANCZOS).save(os.path.join(out_dir, 'logo-stacked-2x.png'))
    src_stacked.resize((720, 720), Image.Resampling.LANCZOS).save(os.path.join(out_dir, 'logo-stacked-3x.png'))

    # Apple Touch Icon (180x180) - stacked mark on navy square
    apple_icon = src_stacked.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon.save(os.path.join(out_dir, 'apple-touch-icon.png'))
    apple_icon.save('./pulse/public/apple-touch-icon.png')

    # PWA Icons: 192x192 & 512x512
    pwa192 = src_stacked.resize((192, 192), Image.Resampling.LANCZOS)
    pwa192.save(os.path.join(out_dir, 'icon-192.png'))
    pwa192.save('./pulse/public/icon-192.png')

    pwa512 = src_stacked.resize((512, 512), Image.Resampling.LANCZOS)
    pwa512.save(os.path.join(out_dir, 'icon-512.png'))
    pwa512.save('./pulse/public/icon-512.png')

    # Maskable PWA icons (with safe margin for circular/rounded masking)
    mask192 = Image.new('RGBA', (192, 192), (3, 23, 59, 255))
    inner192 = src_stacked.resize((150, 150), Image.Resampling.LANCZOS)
    mask192.paste(inner192, (21, 21), inner192)
    mask192.save(os.path.join(out_dir, 'icon-maskable-192.png'))

    mask512 = Image.new('RGBA', (512, 512), (3, 23, 59, 255))
    inner512 = src_stacked.resize((400, 400), Image.Resampling.LANCZOS)
    mask512.paste(inner512, (56, 56), inner512)
    mask512.save(os.path.join(out_dir, 'icon-maskable-512.png'))

    # Favicon.ico multi-resolution (16, 32, 48)
    ico_img = src_stacked.resize((48, 48), Image.Resampling.LANCZOS)
    ico_img.save('./pulse/public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    ico_img.save(os.path.join(out_dir, 'favicon.ico'), format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

    # Open Graph Image (1200x630, Navy background, Stacked lockup, short tagline)
    og_img = Image.new('RGB', (1200, 630), (3, 23, 59))
    # Place stacked lockup at center left or center
    # Mark in center
    lockup_og = src_stacked.resize((360, 360), Image.Resampling.LANCZOS)
    og_img.paste(lockup_og, (100, 135))
    
    # Draw tagline and brand text on right
    draw = ImageDraw.Draw(og_img)
    # Draw text cleanly with fallback fonts
    try:
        font_title = ImageFont.truetype("arial.ttf", 46)
        font_sub = ImageFont.truetype("arial.ttf", 26)
        font_badge = ImageFont.truetype("arial.ttf", 18)
    except:
        font_title = font_sub = font_badge = ImageFont.load_default()

    draw.text((520, 200), "Pulse", fill=(255, 255, 255), font=font_title)
    draw.text((520, 265), "Understand employee wellbeing", fill=(234, 240, 248), font=font_title)
    draw.text((520, 320), "before it becomes attrition.", fill=(74, 163, 214), font=font_title)
    draw.text((520, 385), "Privacy-First • Role-Based Analytics • Guided Support", fill=(159, 178, 204), font=font_sub)

    og_img.save(os.path.join(out_dir, 'og-image.png'))
    og_img.save('./pulse/public/og-image.png')

    # Web Manifest
    manifest_content = '''{
  "name": "Pulse Wellbeing & Analytics",
  "short_name": "Pulse",
  "description": "Helps companies understand and improve employee emotional wellbeing and mental wellness.",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#03173B",
  "background_color": "#03173B",
  "icons": [
    {
      "src": "/brand/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/brand/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/brand/icon-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/brand/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}'''
    with open(os.path.join(out_dir, 'site.webmanifest'), 'w', encoding='utf-8') as f:
        f.write(manifest_content)
    with open('./pulse/public/site.webmanifest', 'w', encoding='utf-8') as f:
        f.write(manifest_content)

    print("All brand SVG and PNG assets successfully generated in /public/brand and /public!")

if __name__ == '__main__':
    generate_all_assets()
