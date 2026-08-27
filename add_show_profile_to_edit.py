import re

filepath = 'backend/app/services/MembersServ.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

old_code = """        me.position = request.position
        me.github = request.github
        me.linkedin = request.linkedin
        me.portfolio = request.portfolio
        me.user_id = current_user_id"""

new_code = """        me.position = request.position
        me.github = request.github
        me.linkedin = request.linkedin
        me.portfolio = request.portfolio
        if request.show_profile is not None:
            me.show_profile = request.show_profile
        me.user_id = current_user_id"""

text = text.replace(old_code, new_code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

