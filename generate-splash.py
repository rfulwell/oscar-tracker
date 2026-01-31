#!/usr/bin/env python3
"""Generate iOS splash screens for Oscar Tracker"""

from PIL import Image, ImageDraw
import os

# iOS splash screen sizes (width x height)
SPLASH_SIZES = [
    (1290, 2796),  # iPhone 15 Pro Max
    (1179, 2556),  # iPhone 15 Pro
    (1170, 2532),  # iPhone 14
    (750, 1334),   # iPhone SE
    (2048, 2732),  # iPad Pro 12.9"
    (1668, 2388),  # iPad Pro 11"
]

# Colors
BG_COLOR = (10, 10, 10)
GOLD = (212, 175, 55)

def draw_trophy(draw, cx, cy, scale):
    """Draw a centered trophy at the given position and scale"""
    
    def s(val, offset=0):
        """Scale and offset a value"""
        return int((val - 256) * scale + offset)
    
    def sw(val):
        """Scale a width value"""
        return max(1, int(val * scale))
    
    # Trophy cup body
    cup_points = [
        (cx + s(156), cy + s(100)),
        (cx + s(356), cy + s(100)),
        (cx + s(356), cy + s(190)),
        (cx + s(306), cy + s(300)),
        (cx + s(256), cy + s(380)),
        (cx + s(206), cy + s(300)),
        (cx + s(156), cy + s(190)),
    ]
    draw.polygon(cup_points, fill=GOLD)
    
    # Handles
    handle_width = sw(16)
    draw.arc([cx + s(76), cy + s(100), cx + s(176), cy + s(280)], 
             start=90, end=270, fill=GOLD, width=handle_width)
    draw.arc([cx + s(336), cy + s(100), cx + s(436), cy + s(280)], 
             start=-90, end=90, fill=GOLD, width=handle_width)
    
    # Stem
    stem_width = sw(40)
    draw.rectangle([cx - stem_width//2, cy + s(370), 
                    cx + stem_width//2, cy + s(430)], fill=GOLD)
    
    # Base
    base_top_width = sw(120)
    draw.rectangle([cx - base_top_width//2, cy + s(420), 
                    cx + base_top_width//2, cy + s(445)], fill=GOLD)
    
    base_width = sw(180)
    draw.rectangle([cx - base_width//2, cy + s(440), 
                    cx + base_width//2, cy + s(470)], fill=GOLD)

def create_splash(width, height):
    """Create a splash screen at the specified size"""
    img = Image.new('RGB', (width, height), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Center the trophy, slightly above center
    cx = width // 2
    cy = int(height * 0.4)
    
    # Scale based on the smaller dimension
    min_dim = min(width, height)
    scale = min_dim / 512 * 0.25
    
    draw_trophy(draw, cx, cy, scale)
    
    return img

def main():
    splash_dir = '/home/claude/oscar-tracker/splash'
    os.makedirs(splash_dir, exist_ok=True)
    
    for width, height in SPLASH_SIZES:
        img = create_splash(width, height)
        filename = f'splash-{width}x{height}.png'
        img.save(f'{splash_dir}/{filename}', 'PNG', optimize=True)
        print(f'Created {filename}')
    
    print('Done!')

if __name__ == '__main__':
    main()
