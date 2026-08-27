import os
import re

def process_card(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Remove import { Link } from 'react-router-dom';
    text = re.sub(r"import\s*{\s*Link\s*}\s*from\s*['\"]react-router-dom['\"];\n?", "", text)

    # Replace <Link to={...} with <div
    text = re.sub(r'<Link\s+to=\{[^}]+\}', '<div', text)

    # Replace </Link> with </div>
    text = text.replace('</Link>', '</div>')

    # Remove line-clamp-3 so full content can be read since there's no detail page
    text = text.replace('line-clamp-3', '')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

process_card('frontend/src/components/cards/BlogCard.jsx')
process_card('frontend/src/components/cards/NewsCard.jsx')

