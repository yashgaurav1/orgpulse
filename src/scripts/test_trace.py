import math
from PIL import Image

def trace_mask_to_svg_paths(mask_img, epsilon=0.7):
    w, h = mask_img.size
    pixels = [[1 if mask_img.getpixel((x, y)) > 128 else 0 for x in range(w)] for y in range(h)]
    
    # Directions: 8-connected clockwise
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

if __name__ == '__main__':
    stroke_mask = Image.open('pulse/public/brand/stroke_mask.png').convert('L')
    stroke_path = trace_mask_to_svg_paths(stroke_mask, 0.6)
    print(f"Traced stroke path length: {len(stroke_path)} chars")
    
    wm_mask = Image.open('pulse/public/brand/wordmark_mask.png').convert('L')
    wm_path = trace_mask_to_svg_paths(wm_mask, 0.6)
    print(f"Traced wordmark path length: {len(wm_path)} chars")
