filepath = 'admin/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "import Contacts from './pages/Contacts';" in line:
        new_lines.append(line)
        new_lines.append("import Newsletter from './pages/Newsletter';\n")
    elif "<Route path={Routes.Contacts.path} element={<Contacts />} />" in line:
        new_lines.append(line)
        new_lines.append("            <Route path={Routes.Newsletter.path} element={<Newsletter />} />\n")
    else:
        new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
