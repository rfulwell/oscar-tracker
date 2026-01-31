#!/usr/bin/env python3
"""Generate PWA icons for Oscar Tracker"""

from PIL import Image, ImageDraw
import os

# Icon sizes needed
SIZES = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512]
MASKABLE_SIZES = [192, 512]

# Colors
BG_COLOR = (10, 10, 10)  # #0a0a0a
GOLD_DARK = (184, 150, 12)  # #b8960c
GOLD = (212, 175, 55)  # #d4af37
GOLD_LIGHT = (244, 208, 63)  # #f4d03f

def draw_trophy(draw, size, padding_factor=0.15):
    """Draw a trophy icon scaled to the given size"""
    padding = int(size * padding_factor)
    inner_size = size - (padding * 2)
    
    # Scale factor relative to a 512 base
    scale = inner_size / 512
    
    def s(val):
        """Scale a value"""
        return int(val * scale) + padding
    
    def sw(val):
        """Scale a width value"""
        return max(1, int(val * scale))
    
    # Trophy cup body (simplified as polygon)
    cup_points = [
        (s(156), s(100)),  # top left
        (s(356), s(100)),  # top right
        (s(356), s(190)),  # right upper
        (s(306), s(300)),  # right curve
        (s(256), s(380)),  # bottom center
        (s(206), s(300)),  # left curve
        (s(156), s(190)),  # left upper
    ]
    draw.polygon(cup_points, fill=GOLD)
    
    # Left handle
    handle_width = sw(16)
    draw.arc([s(76), s(100), s(176), s(280)], start=90, end=270, fill=GOLD, width=handle_width)
    
    # Right handle  
    draw.arc([s(336), s(100), s(436), s(280)], start=-90, end=90, fill=GOLD, width=handle_width)
    
    # Stem
    stem_width = sw(40)
    stem_left = s(256) - stem_width // 2
    draw.rectangle([stem_left, s(370), stem_left + stem_width, s(430)], fill=GOLD)
    
    # Base top
    base_top_width = sw(120)
    base_top_left = s(256) - base_top_width // 2
    draw.rectangle([base_top_left, s(420), base_top_left + base_top_width, s(445)], fill=GOLD)
    
    # Base bottom
    base_width = sw(180)
    base_left = s(256) - base_width // 2
    draw.rectangle([base_left, s(440), base_left + base_width, s(470)], fill=GOLD)

def create_icon(size, maskable=False):
    """Create an icon at the specified size"""
    img = Image.new('RGBA', (size, size), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)
    
    # For maskable icons, use more padding (safe zone is 80% of icon)
    padding_factor = 0.25 if maskable else 0.12
    draw_trophy(draw, size, padding_factor)
    
    return img

def main():
    icons_dir = '/home/claude/oscar-tracker/icons'
    os.makedirs(icons_dir, exist_ok=True)
    
    # Generate regular icons
    for size in SIZES:
        img = create_icon(size, maskable=False)
        img.save(f'{icons_dir}/icon-{size}.png', 'PNG')
        print(f'Created icon-{size}.png')
    
    # Generate maskable icons
    for size in MASKABLE_SIZES:
        img = create_icon(size, maskable=True)
        img.save(f'{icons_dir}/icon-maskable-{size}.png', 'PNG')
        print(f'Created icon-maskable-{size}.png')
    
    print('Done!')

if __name__ == '__main__':
    main()
