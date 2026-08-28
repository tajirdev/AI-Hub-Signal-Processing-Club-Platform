import re

filepath = 'frontend/src/components/layout/Navbar.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# I will replace the entire NAV_GROUPS array for accuracy.
old_nav_groups = """const NAV_GROUPS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Members', href: '/members' },
  { label: 'Contact', href: '/contact' },
  {
    label: 'Initiatives',
    items: [
      { label: 'Sub-Groups', href: '/sub-groups' },
      { label: 'Research', href: '/research' },
      { label: 'Projects', href: '/projects' },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'Events', href: '/events' },
      { label: 'Blog', href: '/blog' },
        { label: 'News', href: '/news' },
      { label: 'Resources', href: '/resources' },
    ],
  },
];"""

new_nav_groups = """const NAV_GROUPS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Members', href: '/members' },
  {
    label: 'Initiatives',
    items: [
      { label: 'Sub-Groups', href: '/sub-groups' },
      { label: 'Research', href: '/research' },
      { label: 'Projects', href: '/projects' },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'Events', href: '/events' },
      { label: 'Blog', href: '/blog' },
      { label: 'News', href: '/news' },
      { label: 'Resources', href: '/resources' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];"""

text = text.replace(old_nav_groups, new_nav_groups)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

