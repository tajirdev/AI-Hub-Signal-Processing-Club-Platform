import re

filepath = 'frontend/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

scroll_to_top_component = """import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
"""

if 'import { BrowserRouter, Routes, Route } from \'react-router-dom\';' in text:
    text = text.replace("import { BrowserRouter, Routes, Route } from 'react-router-dom';", scroll_to_top_component)

if '<BrowserRouter>\n        <Routes>' in text:
    text = text.replace('<BrowserRouter>\n        <Routes>', '<BrowserRouter>\n        <ScrollToTop />\n        <Routes>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

