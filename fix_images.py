import re

# Read the Shop.js file
with open('src/components/Shop.js', 'r', encoding='utf-8') as file:
    content = file.read()

# Find all placeholder URLs and replace them with picsum.photos URLs
counter = 1
def replace_url(match):
    global counter
    result = f"'https://picsum.photos/300/300?random={counter}'"
    counter += 1
    return result

# Replace all via.placeholder.com URLs
content = re.sub(r"'https://via\.placeholder\.com/[^']+?'", replace_url, content)

# Write the fixed content back
with open('src/components/Shop.js', 'w', encoding='utf-8') as file:
    file.write(content)

print(f"Fixed {counter-1} image URLs in Shop.js")
