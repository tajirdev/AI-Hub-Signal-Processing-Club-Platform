# Phase 4: Comprehensive CRUD & Authorization Test Report

- ? **Category: Admin Create**: Admin successfully created a category.
- ? **Category: Editor Create (Blocked)**: Editor correctly blocked from creating a category.
- ? **SubGroup: Admin Create**: Admin created subgroup.
- ? **SubGroup: Editor Create (Blocked)**: Editor blocked from creating subgroup. Status: 403
- ? **SubGroup: Admin Edit**: Admin edited subgroup. Status: 200
- ? **Blog: Editor Create**: Editor created blog successfully.
- ? **Blog: Editor Edit Own**: Editor edited own blog.
- ? **Blog: Member Edit (Blocked)**: Member blocked from editing blog. Status: 403
- ? **Blog: Admin Edit (Override)**: Admin overrode editor's blog. Status: 200
- ? **Project: Editor Create**: Editor created project.
- ? **Project: Editor Edit Own**: Editor edited own project.
- ? **Project: Admin Edit (Override)**: Admin overrode editor's project. Status: 200
- ? **Project: Admin Delete**: Admin deleted project. Status: 200
- ? **Resource: Editor Create**: Editor created resource.
- ? **Resource: Member Create (Blocked)**: Member blocked from creating resource. Status: 403
- ? **Resource: Editor Edit Own**: Editor edited own resource.
- ? **Resource: User Edit (Blocked)**: User blocked from editing resource. Status: 403
- ? **Resource: Admin Delete**: Admin deleted resource. Status: 200