import re

filepath = 'frontend/src/components/layout/Navbar.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add useNavigate to imports
if 'useNavigate' not in text:
    text = text.replace("import { Link, useLocation } from 'react-router-dom';", "import { Link, useLocation, useNavigate } from 'react-router-dom';")

# Add handleLogout function
handle_logout_code = """  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };"""
text = text.replace("  const { isAuthenticated, logout, user } = useAuth();", handle_logout_code)

# Replace onClick={logout} with onClick={handleLogout}
text = text.replace("onClick={logout}", "onClick={handleLogout}")
text = text.replace("onClick={() => { logout(); setMobileMenuOpen(false); }}", "onClick={handleLogout}")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

