import re

filepath = 'frontend/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
import_statement = "import { NotFoundPage } from './features/common/NotFoundPage';\n"
if 'NotFoundPage' not in text:
    text = text.replace("import { ResetPasswordPage } from './features/auth/ResetPasswordPage';", "import { ResetPasswordPage } from './features/auth/ResetPasswordPage';\n" + import_statement)

# Replace the Route element
text = text.replace('<Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />', '<Route path="*" element={<NotFoundPage />} />')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

