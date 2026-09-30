---
name: DocFin
description: Multimodal Document Intelligence & Analysis Platform
colors:
  primary: "#2563EB"
  primary-dark: "#1D4ED8"
  action-cta: "#1E7145"
  action-cta-hover: "#185E39"
  neutral-bg: "#F8FAFC"
  neutral-surface: "#FFFFFF"
  neutral-dark-bg: "#07090E"
  neutral-dark-surface: "#0E121A"
  text-primary: "#0F172A"
  text-secondary: "#334155"
  text-muted: "#64748B"
  border-subtle: "#DCE5F0"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.375rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.action-cta}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.action-cta-hover}"
  button-secondary:
    backgroundColor: "#F4F7FC"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "14px 20px"
---

# Design System: DocFin

## Overview

**Creative North Star: "The Modern Document Prism"**

DocFin embodies an intelligent, calm, high-precision document analysis environment. It rejects heavy, noisy fintech dashboards and generic AI marketing gradients in favor of clear typography, generous breathing room, high-contrast readable text, and focused single-action controls.

### Key Characteristics:
- Serene light-bluish canvas (`#F8FAFC` / `#F4F7FC`) with subtle spatial grid textures.
- High-contrast Deep Navy headlines (`#0F172A`) paired with editorial Newsreader serif typography.
- Emerald green pill CTAs (`#1E7145`) with underlined action text.
- 3-zone conversational workspace with a collapsible document history sidebar.

## Colors

The palette balances clean slate neutrals with DocFin blue accents and emerald action triggers.

### Primary
- **DocFin Blue** (`#2563EB`): Used for brand icons, active tabs, focus rings, and coordinate citation badges.

### Neutral
- **Deep Navy** (`#0F172A`): Primary headings and high-contrast labels.
- **Readable Slate** (`#334155`): Body text and analytical descriptions.
- **Muted Slate** (`#64748B` / `#8092A7`): Secondary metadata, page numbers, timestamps, and mono tags.
- **Canvas White / Cool Blue** (`#F8FAFC` / `#FFFFFF`): Backgrounds and card surfaces.
- **Subtle Border** (`#DCE5F0`): Card outlines and section dividers.

### Named Rules
**The High Contrast Rule.** Primary text must maintain at least a 7:1 contrast ratio against the background canvas at all times.

## Typography

**Display Font:** Newsreader (Editorial Serif)  
**Body Font:** Plus Jakarta Sans (Modern Geometric Sans)  
**Code/Mono Font:** JetBrains Mono  

### Hierarchy
- **Display** (Bold 700, clamp(2.25rem, 5vw, 3.375rem), 1.12): Hero headlines.
- **Headline** (SemiBold 600, 2rem, 1.2): Section titles.
- **Title** (Bold 700, 1.125rem, 1.35): Card headers and finding titles.
- **Body** (Regular 400, 0.875rem, 1.6): Analytical summaries, findings, and chat messages.
- **Label** (SemiBold 600, 0.6875rem, JetBrains Mono): Domain tags, page citations, and metadata.

## Layout

- **Homepage**: 12-column grid max-width 6xl (1152px), generous vertical rhythm (py-24 to py-32).
- **Workspace**: 3-zone layout with collapsible left control rail (w-60), center conversational feed (max-w-3xl), and collapsible right history sidebar (w-72 to w-80).

## Elevation & Depth

Surfaces rely primarily on clean borders (`border-[#DCE5F0]`) and subtle ambient shadows (`shadow-sm` to `shadow-md`) rather than heavy multi-layer drop shadows.

## Shapes

- **Cards**: Large rounded squircles (`rounded-3xl` / 24px radius).
- **Action Buttons & Inputs**: Capsule pills (`rounded-full` / 9999px radius).
- **Icons & Badges**: Squircle boxes (`rounded-xl` to `rounded-2xl` / 12px-16px radius).

## Components

### Buttons
- **Primary Action**: Pill shape (`rounded-full`), emerald green (`#1E7145`), white text with underlined label `[ <u>Action Text</u> → ]`.
- **Secondary Action**: Pill shape, soft background (`#F4F7FC`), dark slate text with subtle border.

### Chat & Message Cards
- **Assistant Response**: White/dark card (`rounded-3xl`), border `#DCE5F0`, inline markdown with green check coordinate citation footer.
- **User Prompt**: DocFin Blue capsule (`#2563EB`), white text.

## Do's and Don'ts

### Do:
- **Do** preserve 7:1 high contrast for all text elements.
- **Do** anchor every finding to a page coordinate citation.
- **Do** keep the middle chat canvas clean and uncluttered before the user prompts.

### Don't:
- **Don't** add decorative filler cards or fake credibility badges.
- **Don't** use low-contrast gray text on light-blue surfaces.
- **Don't** make the interface look like a crowded banking dashboard.
