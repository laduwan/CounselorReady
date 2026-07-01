#!/bin/bash
# CounselorReady Color Migration Script
# Run from: client/public/
# NOTE: Only fixes deprecated named colors. Does NOT change backgrounds.
echo "CounselorReady Color Migration"

# Old Navy -> New Navy
sed -i 's/#34495E/#284157/gI' *.html css/*.css 2>/dev/null
sed -i 's/#34495e/#284157/g' *.html css/*.css 2>/dev/null
echo "Done: Navy 34495E -> 284157"

# Forest Green -> Hunter Green
sed -i 's/#40634A/#4A7C59/gI' *.html css/*.css 2>/dev/null
sed -i 's/#40634a/#4A7C59/g' *.html css/*.css 2>/dev/null
echo "Done: Forest 40634A -> 4A7C59"

# Moss -> Hunter Green
sed -i 's/#4B5D4B/#4A7C59/gI' *.html css/*.css 2>/dev/null
sed -i 's/#4b5d4b/#4A7C59/g' *.html css/*.css 2>/dev/null
echo "Done: Moss 4B5D4B -> 4A7C59"

# Dusty Rose -> Burgundy 700
sed -i 's/#7D4E57/#8B2542/gI' *.html css/*.css 2>/dev/null
sed -i 's/#7d4e57/#8B2542/g' *.html css/*.css 2>/dev/null
echo "Done: DustyRose 7D4E57 -> 8B2542"

# Old charcoal -> Navy 600
sed -i 's/#2c3e50/#1F3345/gI' *.html css/*.css 2>/dev/null
echo "Done: Charcoal 2c3e50 -> 1F3345"

echo ""
echo "Migration complete."
echo "Backgrounds NOT changed (stone #FAFAF9 kept as-is)."
echo "Review interactive-course.html and settings.html visually."
