filepath = 'admin/src/components/Sidebar.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "faFolderOpen," in line:
        new_lines.append(line)
        new_lines.append("  faEnvelopeOpenText,\n")
    elif "{ title: 'Contact Messages', path: Routes.Contacts.path, icon: faEnvelope }," in line:
        new_lines.append(line)
        new_lines.append("      { title: 'Newsletter Subscribers', path: Routes.Newsletter.path, icon: faEnvelopeOpenText },\n")
    else:
        new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
