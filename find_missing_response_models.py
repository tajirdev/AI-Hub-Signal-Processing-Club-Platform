import os
import re

for root, dirs, files in os.walk('backend/app/routes'):
    for file in files:
        if file.endswith('.py') and file != "__init__.py":
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            # Find decorators
            decorators = re.findall(r'@router\.(get|post|put|delete|patch)\([^\)]+\)', content)
            missing = [d for d in decorators if 'response_model' not in d]
            if missing:
                print(f"{file} missing response_model in {len(missing)} routes")
