# 3-Minute Demo Script

## 0:00-0:20 - Hook

"Every home has a drawer, closet, or garage full of items we no longer use. The hard part is not caring about sustainability. The hard part is knowing what to do next."

Show the HomeCycle AI landing page.

## 0:20-0:45 - Product Flow

"HomeCycle AI turns a photo into a circular-economy recommendation. I sign in, upload a household item, and GPT-5.6 Vision analyzes what it is, what it is made of, its condition, and the best next action."

Navigate to login, then dashboard.

## 0:45-1:35 - Live Scan

"I can use camera, gallery, or drag-and-drop upload. The app stores the image in Supabase Storage, sends only a user-owned storage path to the backend, and the backend creates a short-lived signed URL for OpenAI."

Upload an item photo and show the skeleton loader.

"The response is strict structured JSON, not loose prose, so the UI can reliably show recommendation, resale estimate, repair fit, donation fit, recycling fit, safety notes, and environmental impact."

Show the recommendation panel.

## 1:35-2:10 - Dashboard

"When I save a scan, it becomes part of my circular inventory. The dashboard tracks carbon saved, landfill avoided, potential resale value, impact score, recent scans, and action mix."

Navigate to dashboard and history.

## 2:10-2:40 - Architecture

"The app uses Next.js 15, React 19, Supabase Auth, Postgres, Storage, and the OpenAI Responses API. Supabase RLS protects each household's data. The API route validates auth, verifies image ownership, rate-limits analysis, calls GPT-5.6 Vision, validates the response with Zod, then stores the result."

Show README architecture diagram.

## 2:40-3:00 - Codex and GPT-5.6

"Codex was used throughout development as a senior full-stack engineer, reviewer, product designer, and deployment partner. GPT-5.6 powers the multimodal reasoning inside the product, helping households make practical, lower-waste decisions in seconds."

End on the recommendation or dashboard screen.
