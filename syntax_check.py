import ast
import os
import sys

def check_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        ast.parse(content, filename=filepath)
        return True, ""
    except SyntaxError as e:
        return False, f"{filepath}: Syntax error: {e}"
    except Exception as e:
        return False, f"{filepath}: Error: {e}"

issues = []
for root, dirs, files in os.walk('backend/app'):
    for file in files:
        if file.endswith('.py'):
            path = os.path.join(root, file)
            success, msg = check_file(path)
            if not success:
                issues.append(msg)

if issues:
    print("Found syntax errors:")
    for issue in issues:
        print(issue)
    sys.exit(1)
else:
    print("All python files have valid syntax.")
