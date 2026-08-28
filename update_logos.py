import re

def fix_logo(filepath, is_footer=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    if is_footer:
        # Fix Footer
        old_brand = """<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-navy font-heading font-black text-2xl">
                AI
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl leading-none text-white">AI &</span>
                <span className="font-body text-sm text-gray-300 font-semibold tracking-wide">SigniAI</span>
              </div>"""
        
        new_brand = """<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-navy font-heading font-black text-3xl">
                S
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-heading font-black text-2xl leading-none text-white tracking-wide">SigniAI</span>
              </div>"""
        
        text = text.replace(old_brand, new_brand)
    else:
        # Fix Navbar
        old_brand = """<div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white font-heading font-black text-xl">
              AI
            </div>
            <div className="flex flex-col">
              <span className={cn("font-heading font-black text-lg leading-none", isScrolled ? "text-navy dark:text-white" : "text-navy dark:text-white")}>AI &</span>
              <span className="font-body text-xs text-gray-500 font-semibold tracking-wide">SigniAI</span>
            </div>"""
        
        new_brand = """<div className="w-10 h-10 bg-navy dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-navy font-heading font-black text-2xl">
              S
            </div>
            <div className="flex flex-col justify-center">
              <span className={cn("font-heading font-black text-xl leading-none tracking-wide", isScrolled ? "text-navy dark:text-white" : "text-navy dark:text-white")}>SigniAI</span>
            </div>"""
        
        text = text.replace(old_brand, new_brand)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

fix_logo('frontend/src/components/layout/Navbar.jsx', False)
fix_logo('frontend/src/components/layout/Footer.jsx', True)

