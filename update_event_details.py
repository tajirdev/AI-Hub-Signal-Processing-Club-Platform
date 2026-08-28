import re

filepath = 'frontend/src/features/events/EventDetailsPage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("import { ArrowLeft, ExternalLink, Calendar, MapPin, Tag } from 'lucide-react';", 
                    "import { ArrowLeft, ExternalLink, Calendar, MapPin, Tag, User } from 'lucide-react';")

creator_ui = """              )}
            </div>

            {event.user && (
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-navy/10 dark:border-white/10">
                {event.user.avatar_url ? (
                  <img src={getImageUrl(event.user.avatar_url)} alt={event.user.first_name} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-[#0a1628] shadow-sm" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-navy/10 dark:bg-white/10 flex items-center justify-center text-navy dark:text-white font-bold shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">Organized by</span>
                  <span className="text-sm font-semibold text-navy dark:text-white">{event.user.first_name} {event.user.last_name}</span>
                </div>
              </div>
            )}

            {event.registration_link && ("""

text = text.replace('              )}\n            </div>\n\n            {event.registration_link && (', creator_ui)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

