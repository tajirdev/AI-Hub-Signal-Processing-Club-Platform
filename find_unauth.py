import os
import re

for root, dirs, files in os.walk('backend/app/routes'):
    for file in files:
        if file.endswith('.py') and file != "__init__.py":
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all endpoints
            endpoints = re.split(r'@router\.', content)[1:]
            for endpoint in endpoints:
                if 'def ' in endpoint:
                    method_decl = endpoint.split('def ')[1].split('):')[0]
                    route_type = endpoint.split('(')[0]
                    # if it's a mutating method (post, put, delete, patch)
                    if route_type in ['post', 'put', 'delete', 'patch']:
                        # look for user dependency
                        if 'current_user' not in method_decl and 'Depends(admin_required)' not in method_decl and 'Depends(get_current_user)' not in method_decl and 'Depends(RoleChecker' not in method_decl:
                            # skip auth and contact/newsletter public endpoints
                            if 'login' not in file and 'registration' not in endpoint and 'contact' not in file and 'Newsletter' not in file and 'otp' not in endpoint and 'reset' not in endpoint:
                                print(f"WARNING: Potentially unauthenticated mutating endpoint in {file}: def {method_decl.split('(')[0]}")
