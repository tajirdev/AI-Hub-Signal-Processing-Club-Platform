import re

filepath = 'frontend/src/features/members/MemberProfilePage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('import { Mail, Phone, Code, Globe, Briefcase, ArrowLeft } from "lucide-react";', 
                    'import { Mail, Phone, Code, Globe, Briefcase, ArrowLeft, Calendar, Edit, ShieldAlert, LogOut } from "lucide-react";')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

