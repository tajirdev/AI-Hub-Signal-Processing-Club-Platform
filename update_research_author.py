import re

# Update ManageContentTab.jsx
filepath_tab = 'frontend/src/features/members/components/ManageContentTab.jsx'
with open(filepath_tab, 'r', encoding='utf-8') as f:
    text_tab = f.read()

text_tab = text_tab.replace(
    'editingItem={editingItem}',
    'editingItem={editingItem}\n        memberId={profile?.id}'
)

with open(filepath_tab, 'w', encoding='utf-8') as f:
    f.write(text_tab)

# Update ContentFormModal.jsx
filepath_modal = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath_modal, 'r', encoding='utf-8') as f:
    text_modal = f.read()

text_modal = text_modal.replace(
    'export function ContentFormModal({ isOpen, onClose, categoryId, editingItem, onSuccess }) {',
    'export function ContentFormModal({ isOpen, onClose, categoryId, editingItem, onSuccess, memberId }) {'
)

old_payload = """        payload[f.name] = val;
      });"""

new_payload = """        payload[f.name] = val;
      });
      
      // Inject author_ids for research if missing
      if (categoryId === 'research' && memberId) {
        payload.author_ids = [memberId];
      }
      """

text_modal = text_modal.replace(old_payload, new_payload)

with open(filepath_modal, 'w', encoding='utf-8') as f:
    f.write(text_modal)

