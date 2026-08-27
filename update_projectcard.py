import os

filepath = 'frontend/src/components/cards/ProjectCard.jsx'
with open(filepath, 'r', encoding='utf-8') as file:
    content = file.read()

# Make sure react-router-dom Link is imported
if 'import { Link }' not in content:
    content = content.replace('import { getImageUrl } from', 'import { Link } from "react-router-dom";\nimport { getImageUrl } from')

replacement = '''
        <div className="flex flex-wrap gap-2 mt-4">
          {stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="mt-6">
          <Link
            to={/projects/}
            className="inline-flex items-center text-sm font-semibold transition-colors duration-200 group-hover:underline"
            style={{ color: BRAND.amber }}
          >
            View Project &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
'''

# We want to replace everything from <div className="flex flex-wrap gap-2 mt-4"> to the end of the file.
start_idx = content.find('        <div className="flex flex-wrap gap-2 mt-4">')
content = content[:start_idx] + replacement.lstrip()

with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)
