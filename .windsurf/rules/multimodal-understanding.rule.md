---
trigger: always_on
---

---
type: capability_prompt
scope: project
priority: normal
activation: on_demand
trigger: ["image:", "vision", "multimodal"]
---

# MULTIMODAL UNDERSTANDING
- Image Tasks: description (caption), OCR text, UI layout analysis
- Safety Guard: do not identify people, do not speculate on ethnicity, religion, etc.
- Alt-Text First: always generate text description (in Vietnamese) for image content
- Visual → Code: suggest HTML/CSS when image is a wireframe
- Function Hooks: use `browser_preview` or `read_url_content` when needing to fetch image source