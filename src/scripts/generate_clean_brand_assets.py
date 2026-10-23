import os
import math
from PIL import Image, ImageDraw

NAVY = "#03173B"        # RGB(3, 23, 59)
RED = "#BF1111"         # RGB(191, 17, 17)
BLUE = "#2E8EBF"        # RGB(46, 142, 191)
MARK_STROKE = "#E0E0E0" # RGB(224, 224, 224)
WHITE = "#FFFFFF"

# Exact circle geometry in 500x500 space
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
                    if len(contour) >= 10:
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

def main():
    brand_dir = './pulse/public/brand'
    os.makedirs(brand_dir, exist_ok=True)
    
    # 1. Prepare clean masks
    s_full = Image.open(os.path.join(brand_dir, 'stroke_mask.png')).convert('L')
    w, h = s_full.size
    
    # Head stroke mask only (y <= 316) - ABSOLUTELY NO WORDMARK
    head_mask = Image.new('L', (w, h), 0)
    for y in range(h):
        if y <= 316:
            for x in range(w):
                if s_full.getpixel((x, y)) > 128:
                    head_mask.putpixel((x, y), 255)
                    
    # Wordmark mask only (y >= 325)
    wm_mask = Image.new('L', (w, h), 0)
    for y in range(h):
        if y >= 325:
            for x in range(w):
                if s_full.getpixel((x, y)) > 128:
                    wm_mask.putpixel((x, y), 255)
                    
    head_d = trace_mask_to_svg_paths(head_mask, 0.50)
    wm_d = trace_mask_to_svg_paths(wm_mask, 0.50)
    
    print("Traced head path length:", len(head_d))
    print("Traced wordmark path length:", len(wm_d))
    
    # Bounding box for mark alone: x in [120, 375], y in [95, 350] -> viewBox="115 95 260 255"
    MARK_VB = "115 95 260 255"
    
    # 1. mark.svg (Clean, Transparent, NO background rect, NO baked wordmark)
    mark_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{MARK_VB}" width="100%" height="100%">
  <!-- Red Circle (upper-left, back) -->
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <!-- Blue Circle (lower-right, front) -->
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <!-- Head & Circuit Trace Lines (Original stroke) -->
  <path d="{head_d}" fill="{MARK_STROKE}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(brand_dir, 'mark.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_svg)
        
    # 2. mark-light.svg (TWO-TONE STROKE: navy base stroke + white stroke clipped to circle union)
    mark_light_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{MARK_VB}" width="100%" height="100%">
  <defs>
    <!-- Union of both circles for two-tone stroke clipping -->
    <clipPath id="circle-union">
      <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" />
      <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" />
    </clipPath>
  </defs>
  <!-- Red Circle (upper-left, back) -->
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <!-- Blue Circle (lower-right, front) -->
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <!-- Navy stroke visible outside circles on light backgrounds -->
  <path d="{head_d}" fill="{NAVY}" fill-rule="evenodd" />
  <!-- White stroke clipped to circles for high contrast against red and blue -->
  <path d="{head_d}" fill="{WHITE}" fill-rule="evenodd" clip-path="url(#circle-union)" />
</svg>'''
    with open(os.path.join(brand_dir, 'mark-light.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_light_svg)
        
    # 3. mark-tile.svg (Mark on rounded navy tile for app launchers, favicons, avatars)
    mark_tile_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" rx="100" fill="{NAVY}" />
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <path d="{head_d}" fill="{MARK_STROKE}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(brand_dir, 'mark-tile.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_tile_svg)
        
    # 4. mark-white.svg (Single-colour all-white for dark mono contexts)
    mark_white_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{MARK_VB}" width="100%" height="100%">
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{WHITE}" fill-opacity="0.25" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{WHITE}" fill-opacity="0.38" />
  <path d="{head_d}" fill="{WHITE}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(brand_dir, 'mark-white.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_white_svg)
        
    # 5. mark-navy.svg (Single-colour all-navy for PDF/print watermarks)
    mark_navy_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{MARK_VB}" width="100%" height="100%">
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{NAVY}" fill-opacity="0.18" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{NAVY}" fill-opacity="0.28" />
  <path d="{head_d}" fill="{NAVY}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(brand_dir, 'mark-navy.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_navy_svg)
        
    # 6. stacked.svg (Transparent background, mark top, white wordmark bottom - NO NAVY SQUARE RECTANGLE)
    STACKED_VB = "115 95 260 300"
    stacked_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{STACKED_VB}" width="100%" height="100%">
  <!-- Circles -->
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <!-- Head & Circuit Trace Lines -->
  <path d="{head_d}" fill="{MARK_STROKE}" fill-rule="evenodd" />
  <!-- Separate Wordmark in White -->
  <path d="{wm_d}" fill="{WHITE}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(brand_dir, 'stacked.svg'), 'w', encoding='utf-8') as f:
        f.write(stacked_svg)
        
    # 7. stacked-light.svg (Transparent background, two-tone mark top, navy wordmark bottom)
    stacked_light_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{STACKED_VB}" width="100%" height="100%">
  <defs>
    <clipPath id="circle-union-stacked">
      <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" />
      <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" />
    </clipPath>
  </defs>
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
  <path d="{head_d}" fill="{NAVY}" fill-rule="evenodd" />
  <path d="{head_d}" fill="{WHITE}" fill-rule="evenodd" clip-path="url(#circle-union-stacked)" />
  <path d="{wm_d}" fill="{NAVY}" fill-rule="evenodd" />
</svg>'''
    with open(os.path.join(brand_dir, 'stacked-light.svg'), 'w', encoding='utf-8') as f:
        f.write(stacked_light_svg)
        
    # 8. horizontal.svg (Mark left, White wordmark right, viewBox="0 0 170 42")
    # Mark in 500 space is centered around x=245, y=225, size ~250.
    # We scale mark by 0.155 (height ~38px, placed at x=0, y=2)
    # In 500 space, wordmark is at x=131..293 (width 162), y=331..386 (height 55).
    # We want wordmark height ~24px, so scale = 24 / 55 = 0.436.
    # Place wordmark at x=46, y=10.
    horizontal_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" width="100%" height="100%">
  <!-- Scaled Mark on Left (height 38px, width ~36px) -->
  <g transform="translate(-16, -12) scale(0.148)">
    <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
    <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
    <path d="{head_d}" fill="{MARK_STROKE}" fill-rule="evenodd" />
  </g>
  <!-- Wordmark 'Pulse' on Right (White for navy/dark backgrounds) -->
  <g transform="translate(-14, -135) scale(0.435)">
    <path d="{wm_d}" fill="{WHITE}" fill-rule="evenodd" />
  </g>
</svg>'''
    with open(os.path.join(brand_dir, 'horizontal.svg'), 'w', encoding='utf-8') as f:
        f.write(horizontal_svg)
        
    # 9. horizontal-light.svg (Two-tone mark on left, Navy wordmark on right)
    horizontal_light_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" width="100%" height="100%">
  <defs>
    <clipPath id="circle-union-hz">
      <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" />
      <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" />
    </clipPath>
  </defs>
  <g transform="translate(-16, -12) scale(0.148)">
    <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
    <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
    <path d="{head_d}" fill="{NAVY}" fill-rule="evenodd" />
    <path d="{head_d}" fill="{WHITE}" fill-rule="evenodd" clip-path="url(#circle-union-hz)" />
  </g>
  <!-- Wordmark 'Pulse' on Right (Navy for light backgrounds) -->
  <g transform="translate(-14, -135) scale(0.435)">
    <path d="{wm_d}" fill="{NAVY}" fill-rule="evenodd" />
  </g>
</svg>'''
    with open(os.path.join(brand_dir, 'horizontal-light.svg'), 'w', encoding='utf-8') as f:
        f.write(horizontal_light_svg)
        
    # 10. horizontal-white.svg (All-white)
    horizontal_white_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" width="100%" height="100%">
  <g transform="translate(-16, -12) scale(0.148)">
    <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{WHITE}" fill-opacity="0.25" />
    <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{WHITE}" fill-opacity="0.38" />
    <path d="{head_d}" fill="{WHITE}" fill-rule="evenodd" />
  </g>
  <g transform="translate(-14, -135) scale(0.435)">
    <path d="{wm_d}" fill="{WHITE}" fill-rule="evenodd" />
  </g>
</svg>'''
    with open(os.path.join(brand_dir, 'horizontal-white.svg'), 'w', encoding='utf-8') as f:
        f.write(horizontal_white_svg)
        
    # 11. horizontal-navy.svg (All-navy for PDF/print)
    horizontal_navy_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" width="100%" height="100%">
  <g transform="translate(-16, -12) scale(0.148)">
    <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{NAVY}" fill-opacity="0.18" />
    <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{NAVY}" fill-opacity="0.28" />
    <path d="{head_d}" fill="{NAVY}" fill-rule="evenodd" />
  </g>
  <g transform="translate(-14, -135) scale(0.435)">
    <path d="{wm_d}" fill="{NAVY}" fill-rule="evenodd" />
  </g>
</svg>'''
    with open(os.path.join(brand_dir, 'horizontal-navy.svg'), 'w', encoding='utf-8') as f:
        f.write(horizontal_navy_svg)

    # 12. motif.svg (Static two-circle crisp motif, full-strength brand colors)
    motif_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="115 95 260 255" width="100%" height="100%">
  <!-- Upper-left Red Circle (back) -->
  <circle cx="{RED_CX}" cy="{RED_CY}" r="{RED_R}" fill="{RED}" />
  <!-- Lower-right Blue Circle (front) -->
  <circle cx="{BLUE_CX}" cy="{BLUE_CY}" r="{BLUE_R}" fill="{BLUE}" />
</svg>'''
    with open(os.path.join(brand_dir, 'motif.svg'), 'w', encoding='utf-8') as f:
        f.write(motif_svg)
        
    # Copy favicon.svg from mark-tile
    with open(os.path.join(brand_dir, 'favicon.svg'), 'w', encoding='utf-8') as f:
        f.write(mark_tile_svg)
    with open('./pulse/public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(mark_tile_svg)
        
    print("All clean vector brand assets generated successfully!")

if __name__ == '__main__':
    main()
