# BharatVerse

### AI-Powered Cultural Discovery Platform for India 🇮🇳

**BharatVerse** is a production-grade, AI-enabled cultural exploration platform that combines **interactive geospatial visualization**, **intelligent recommendation systems**, and **multilingual AI storytelling** to make India’s heritage accessible, personalized, and immersive at scale.

The platform was designed with **real-world usability, scalability, and inclusivity** in mind and showcases strong full-stack + AI engineering practices.

---

## 👤 Role & Ownership (What I Built)

**Garv Bahl — Core Developer (AI, ML & Backend Systems)**

I led the design and implementation of BharatVerse’s **intelligence layer**, focusing on personalization, AI storytelling, and scalable backend architecture.

### Key Responsibilities

* Designed and built the **Salahkar Recommender System**
* Built a **multilingual AI storytelling & narration pipeline**
* Designed and deployed **FastAPI-based AI services**
* Integrated **LLMs** and **Hugging Face Spaces** into a production workflow
* Collaborated closely with frontend for real-time AI feature delivery

---

## Salahkar – Intelligent Recommendation System

**Salahkar** is a domain-aware recommendation engine built to personalize cultural discovery.

### What it does

* Recommends:

  * Heritage sites
  * Hidden cultural gems
  * Temples and experiential locations
* Uses:

  * User interest signals
  * Interaction history
  * Geographic context
* Generates **relevant, non-generic recommendations** instead of static lists

### Engineering Highlights

* Modular recommendation logic for easy ML upgrades
* Designed to support future:

  * Collaborative filtering
  * Embedding-based semantic recommendations
* API-first design for frontend and mobile integration

---

## 🎙️ Multilingual AI Storytelling & Narration (7 Languages)

To make cultural knowledge **inclusive and immersive**, I built an AI-powered storytelling system that converts heritage data into **human-like narratives**.

### Capabilities

* Generates culturally contextual stories using **LLMs**
* Supports **7 languages** for regional accessibility
* Provides both:

  * Text-based storytelling
  * Audio narration via Text-to-Speech

### Tech Architecture

* **FastAPI** for high-performance APIs
* **Hugging Face Spaces** for AI service deployment
* LLM-driven story generation pipelines
* Clean separation of generation, narration, and delivery layers

---

##Platform Features (User-Facing)

### Interactive Cultural Map

* React + Leaflet with multiple base layers
* Custom visual markers:

  * Hidden Gems
  * Heritage Sites
  * Temples

### Smart Discovery

* Filter by region and site type
* Search by place name or state
* Personalized recommendations via Salahkar

### Route Planning & Navigation

* Build custom travel routes
* Live location support
* Optimized visiting order
* One-click Google Maps navigation

### AI-Powered Experiences

* Personalized site recommendations
* Multilingual cultural storytelling with narration

---

## System Architecture Overview

```
Frontend (React + Leaflet)
        |
        v
Backend APIs (FastAPI)
        |
        ├── Salahkar Recommender Engine
        ├── LLM Story Generation Service
        ├── Multilingual TTS Pipeline
        |
        v
Hugging Face Spaces (AI Deployment)
```

Designed for:

* Scalability
* Modular AI upgrades
* Cross-platform expansion (web/mobile)

---

## 🛠️ Tech Stack

### Frontend

* React 18
* React Router
* Tailwind CSS
* React Query
* Zustand
* Leaflet / React-Leaflet

### Backend & AI

* FastAPI
* Hugging Face Spaces
* Large Language Models (LLMs)
* Multilingual Text-to-Speech

### Tooling

* Vite
* npm

---

##  Local Setup

```bash
git clone https://github.com/your-username/BharatVerse.git
cd BharatVerse
npm install
npm run dev
```

---

## Why This Project Stands Out

* Demonstrates **end-to-end AI system design**
* Real-world application of **LLMs beyond chatbots**
* Strong **full-stack + ML integration**
* Built for **scale, inclusivity, and national impact**
* Ideal showcase for:

  * ML / AI Engineer roles
  * Full-Stack Developer roles
  * Applied LLM Engineer roles

---

## Future Enhancements

* Embedding-based semantic recommendations
* User feedback loops for ML retraining
* Voice-first cultural exploration
* Mobile app integration
