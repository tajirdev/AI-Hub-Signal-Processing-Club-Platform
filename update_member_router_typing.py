import re
filepath = 'backend/app/routes/MemberRouter.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('from typing import List\n', 'from typing import List, Optional\n')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
