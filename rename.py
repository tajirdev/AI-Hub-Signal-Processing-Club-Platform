import os
import re

directories = ['frontend/src', 'frontend/public', 'frontend/index.html']

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Precise name replacements
    replacements = [
        (r'AI\s*&\s*Signal\s*Processing\s*Hub', 'SigniAI'),
        (r'AI\s*Hub\s*&\s*Signal\s*Processing\s*Club', 'SigniAI'),
        (r'AI-Hub\s*&\s*Signal\s*Processing\s*Club', 'SigniAI'),
        (r'AI-Hub\s*Signal\s*Processing\s*Club', 'SigniAI'),
        (r'Signal\s*Processing\s*Hub', 'SigniAI'),
        (r'AI\s*Hub', 'SigniAI'),
        (r'AI-Hub', 'SigniAI'),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

for path in directories:
    if os.path.isfile(path):
        process_file(path)
    elif os.path.isdir(path):
        for root, _, files in os.walk(path):
            for file in files:
                if file.endswith(('.jsx', '.js', '.html', '.css')):
                    process_file(os.path.join(root, file))

