import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Update News fields
old_news = """  news: {
    endpoint: "News",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "content", label: "Content", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: ["draft", "published"], default: "draft" }
    ]
  },"""

new_news = """  news: {
    endpoint: "News",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "content", label: "Content", type: "textarea", required: true },
      { name: "news_type", label: "News Type", type: "text", required: true },
      { name: "category_id", label: "Category", type: "dynamic_select" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published"], default: "draft" }
    ]
  },"""

text = text.replace(old_news, new_news)

# Update Error handler
old_error = """      } catch (err) {
        console.error(err);
        let errorMsg = "An error occurred while saving.";
        if (err.response?.data?.detail) {
          if (Array.isArray(err.response.data.detail)) {
            errorMsg = err.response.data.detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join(', ');
          } else if (typeof err.response.data.detail === 'string') {
            errorMsg = err.response.data.detail;
          }
        }
        setError(errorMsg);
      }"""

new_error = """      } catch (err) {
        console.error(err);
        let errorMsg = "An error occurred while saving.";
        if (err.response?.data?.detail) {
          const detail = err.response.data.detail;
          if (Array.isArray(detail)) {
            errorMsg = detail.map(e => `${e.loc ? e.loc.join('.') : 'field'}: ${e.msg}`).join(', ');
          } else if (typeof detail === 'string') {
            errorMsg = detail;
          } else {
            errorMsg = JSON.stringify(detail);
          }
        } else if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      }"""

text = text.replace(old_error, new_error)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

