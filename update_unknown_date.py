import os

filepath_details = 'frontend/src/features/research/ResearchDetailsPage.jsx'
with open(filepath_details, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("'Unknown Date'", "'Ongoing'")

with open(filepath_details, 'w', encoding='utf-8') as f:
    f.write(text)


filepath_card = 'frontend/src/components/cards/ResearchCard.jsx'
with open(filepath_card, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "{research.created_at ? new Date(research.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Recent'}",
    "{research.publication_date ? new Date(research.publication_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Ongoing'}"
)

with open(filepath_card, 'w', encoding='utf-8') as f:
    f.write(text)

