#!/usr/bin/env python3
"""
Portfolio Architecture Diagram Generator
=========================================
Generates project architecture diagrams as PNG files.

Output layout
-------------
  public/images/portfolio/
    {project-id}/
      arch.png   – system architecture diagram

Usage
-----
  python scripts/generate_images.py              # regenerate all
  python scripts/generate_images.py ebook daodao # regenerate specific projects
  python scripts/generate_images.py --list       # show available project IDs

Requirements
------------
  pip install matplotlib numpy
"""

import argparse
import os
import sys

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

# ── Paths ──────────────────────────────────────────────────────────────────────
REPO_ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_ROOT   = os.path.join(REPO_ROOT, "public", "images", "portfolio")

# ── Color Palette ──────────────────────────────────────────────────────────────
BG     = "#0f172a"   # dark navy background
PANEL  = "#1e293b"   # card / panel
CARD   = "#1a2744"   # deeper card
TEAL   = "#38b2ac"
TEAL2  = "#4fd1c5"
BLUE   = "#3b82f6"
PURPLE = "#7c3aed"
GREEN  = "#22c55e"
ORANGE = "#f97316"
RED    = "#ef4444"
YELLOW = "#eab308"
WHITE  = "#f8fafc"
GRAY   = "#94a3b8"
BORDER = "#334155"


# ── Shared Drawing Helpers ─────────────────────────────────────────────────────

def fig_setup(w=16, h=10):
    fig, ax = plt.subplots(figsize=(w, h))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 10)
    ax.axis("off")
    return fig, ax


def _save(fig, project_id, filename="arch.png"):
    out_dir = os.path.join(IMG_ROOT, project_id)
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, filename)
    fig.savefig(path, dpi=120, bbox_inches="tight", facecolor=BG)
    plt.close(fig)
    print(f"  OK  {project_id}/{filename}")


def box(ax, x, y, w, h, label, sublabel=None,
        color=TEAL, bg=PANEL, fontsize=11, radius=0.3):
    ax.add_patch(FancyBboxPatch(
        (x, y), w, h,
        boxstyle=f"round,pad=0.05,rounding_size={radius}",
        linewidth=1.5, edgecolor=color, facecolor=bg,
    ))
    ty = y + h / 2 + (0.18 if sublabel else 0)
    ax.text(x + w / 2, ty, label,
            ha="center", va="center",
            color=WHITE, fontsize=fontsize, fontweight="bold")
    if sublabel:
        ax.text(x + w / 2, y + h / 2 - 0.22, sublabel,
                ha="center", va="center", color=GRAY, fontsize=8)


def arrow(ax, x1, y1, x2, y2, label=None, color=TEAL):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>", color=color,
                                lw=1.8, mutation_scale=18))
    if label:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mx + 0.05, my + 0.15, label, color=color, fontsize=8, ha="center")


def arrow_lr(ax, x1, y1, x2, y2, label=None, color=TEAL):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="<|-|>", color=color,
                                lw=1.8, mutation_scale=16))
    if label:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mx, my + 0.15, label, color=color, fontsize=8, ha="center")


def title_bar(ax, text, subtitle=None):
    ax.add_patch(FancyBboxPatch(
        (0.3, 9.1), 15.4, 0.7,
        boxstyle="round,pad=0.05,rounding_size=0.2",
        linewidth=0, facecolor=TEAL, alpha=0.15,
    ))
    ax.plot([0.5, 15.5], [9.1, 9.1], color=TEAL, lw=1.5, alpha=0.5)
    ax.text(8, 9.5, text, ha="center", va="center",
            color=TEAL2, fontsize=16, fontweight="bold")
    if subtitle:
        ax.text(8, 9.15, subtitle, ha="center", va="center",
                color=GRAY, fontsize=9)


def tag(ax, x, y, text, color=TEAL):
    ax.text(x, y, f"  {text}  ", ha="center", va="center", color=WHITE,
            fontsize=8, fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.25", facecolor=color,
                      edgecolor="none", alpha=0.85))


def section_label(ax, x, y, w, text, color=BLUE):
    ax.text(x + w / 2, y, text, ha="center", va="center",
            color=color, fontsize=9, fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.2", facecolor=BG,
                      edgecolor=color, linewidth=1))


def group_rect(ax, x, y, w, h, label, color=BLUE):
    ax.add_patch(FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0.1,rounding_size=0.3",
        linewidth=2, edgecolor=color, facecolor=color, alpha=0.08, zorder=0,
    ))
    ax.text(x + w / 2, y + h - 0.18, label,
            ha="center", va="center",
            color=color, fontsize=9, fontweight="bold", zorder=1)


# ── Project Diagrams ───────────────────────────────────────────────────────────

def draw_ebook():
    fig, ax = fig_setup()
    title_bar(ax, "Ebook Reader  —  System Architecture",
              "React 19 · Chakra UI · Supabase · React PDF Viewer · IndexedDB")

    box(ax, 0.5, 7.0, 2.2, 0.9, "GitHub OAuth", "Identity Provider",
        color=GREEN, bg="#14291a")
    box(ax, 3.5, 7.0, 2.5, 0.9, "Login Page", "/ (route)", color=TEAL, bg=CARD)
    arrow(ax, 2.72, 7.45, 3.48, 7.45, "OAuth callback", TEAL2)

    box(ax, 3.0, 5.0, 10.0, 1.6, "", color=BLUE, bg="#0d1f3a")
    ax.text(8.0, 6.3, "Dashboard  (/dashboard)",
            ha="center", va="center", color=BLUE, fontsize=12, fontweight="bold")
    for i, it in enumerate(["Book Library (Grid)", "Upload PDF", "Search & Filter",
                             "Statistics (Chart.js)", "Category / Status badges"]):
        ax.text(3.3 + i * 2.0, 5.55, f"• {it}", ha="left", va="center",
                color=GRAY, fontsize=7.5)
    arrow(ax, 6.0, 6.95, 6.0, 6.62, color=BLUE)

    box(ax, 3.0, 3.0, 10.0, 1.6, "", color=PURPLE, bg="#160d2a")
    ax.text(8.0, 4.3, "PDF Reader  (/reader/:bookId)",
            ha="center", va="center", color=PURPLE, fontsize=12, fontweight="bold")
    for i, it in enumerate(["Page Navigation", "Progress Auto-save", "Resume Last Page",
                             "Dark Mode Toggle", "React PDF Viewer"]):
        ax.text(3.3 + i * 2.0, 3.55, f"• {it}", ha="left", va="center",
                color=GRAY, fontsize=7.5)
    arrow(ax, 8.0, 4.98, 8.0, 4.62, color=PURPLE)

    box(ax, 0.5, 0.8, 4.5, 1.8, "Supabase (Cloud)",
        "Auth · Storage · PostgreSQL", color=TEAL, bg=CARD)
    box(ax, 6.2, 0.8, 4.5, 1.8, "IndexedDB (Local)",
        "Offline Cache · PDF Blob · Metadata", color=ORANGE, bg="#2a1a0a")
    arrow_lr(ax, 5.02, 1.7, 6.18, 1.7, "sync", TEAL)
    arrow(ax, 2.75, 2.62, 2.75, 2.98, color=TEAL)
    arrow(ax, 8.45, 2.62, 8.45, 2.98, color=ORANGE)

    box(ax, 11.5, 0.8, 4.0, 1.8, "BookManager.js",
        "Upload · CRUD · Progress", color=GRAY, bg=PANEL)
    ax.text(13.5, 0.5, "Framer Motion · Chart.js",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "ebook")


def draw_daodao():
    fig, ax = fig_setup()
    title_bar(ax, "DaoDAO Education Platform  —  ETL Pipeline Architecture",
              "Apache Airflow · MongoDB · Notion API · PostgreSQL · Next.js")

    section_label(ax, 0.4, 8.85, 6.8, "DATA SOURCES", GRAY)
    box(ax, 0.5, 7.6, 3.0, 1.0, "MongoDB", "users · activities · marathons",
        color=GREEN, bg="#0f2a1a")
    box(ax, 4.2, 7.6, 3.0, 1.0, "Notion API", "Store · Resources",
        color="#6b7280", bg="#1e2030")
    arrow(ax, 2.0, 7.58, 2.0, 6.78, color=GREEN)
    arrow(ax, 5.7, 7.58, 5.7, 6.78, color=GRAY)

    ax.add_patch(FancyBboxPatch((0.4, 5.3), 10.5, 1.38,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=ORANGE, facecolor="#1a1000"))
    ax.text(5.65, 6.48, "Apache Airflow  —  DAG Orchestration",
            ha="center", va="center", color=ORANGE, fontsize=12, fontweight="bold")
    for i, (name, freq, c) in enumerate([
        ("Activities DAG", "Daily",   GREEN),
        ("Users DAG",      "Monthly", TEAL),
        ("Store DAG",      "Daily",   BLUE),
        ("Resources DAG",  "Monthly", PURPLE),
    ]):
        box(ax, 0.6 + i * 2.62, 5.38, 2.4, 0.78, name, freq,
            color=c, bg=PANEL, fontsize=9)
    ax.text(12.5, 5.98, "Extract → Transform → Load",
            ha="center", va="center", color=ORANGE, fontsize=9, alpha=0.7)
    arrow(ax, 5.65, 5.28, 5.65, 4.68, color=ORANGE)

    box(ax, 0.5, 3.6, 10.5, 0.98, "Staging Tables (PostgreSQL)",
        "old_user · old_activities · old_marathons · old_store · old_resource",
        color=GRAY, bg=PANEL, fontsize=10)
    arrow(ax, 5.65, 3.58, 5.65, 3.05, color=GRAY)
    ax.text(5.65, 2.92, "Migration & Normalization Tasks",
            ha="center", va="center", color=BLUE, fontsize=9,
            bbox=dict(boxstyle="round,pad=0.2", facecolor=BG,
                      edgecolor=BLUE, linewidth=1))
    arrow(ax, 5.65, 2.72, 5.65, 2.22, color=BLUE)

    ax.add_patch(FancyBboxPatch((0.4, 0.9), 10.5, 1.22,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=BLUE, facecolor="#0a1628"))
    ax.text(5.65, 1.85, "PostgreSQL  —  Normalized Schema",
            ha="center", va="center", color=BLUE, fontsize=12, fontweight="bold")
    for i, t in enumerate(["Users", "Projects", "Marathons", "Groups", "Store", "Resources"]):
        tag(ax, 1.2 + i * 1.7, 1.12, t, BLUE)

    box(ax, 11.5, 5.5, 4.0, 0.9, "Next.js Web", "Product Platform (port 3001)",
        color=TEAL, bg=CARD, fontsize=10)
    box(ax, 11.5, 4.3, 4.0, 0.9, "React Native", "Mobile App (Expo)",
        color=TEAL2, bg=CARD, fontsize=10)
    arrow(ax, 10.92, 1.5, 11.48, 5.7, color=TEAL)
    arrow(ax, 10.92, 1.5, 11.48, 4.5, color=TEAL2)

    ax.text(5.65, 0.55,
            "Docker Compose · Ansible · Python · Pandas · SQLAlchemy",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "daodao")


def draw_gcp_livekit_infra():
    fig, ax = fig_setup()
    title_bar(ax, "Low Vision Glasses  —  GCP Cloud Architecture",
              "GCP · LiveKit WebRTC · FastAPI · Firebase Auth · Ansible IaC")

    box(ax, 0.4, 7.6, 2.5, 1.0, "Client App", "Low Vision Glasses",
        color=TEAL, bg=CARD)
    ax.text(1.65, 7.25, "HTTPS / WSS / WebRTC UDP",
            ha="center", va="center", color=GRAY, fontsize=7.5)
    box(ax, 4.0, 7.6, 3.0, 1.0, "Firebase Auth",
        "GitHub / Google OAuth · JWT", color=ORANGE, bg="#2a1400")
    arrow(ax, 2.92, 8.1, 3.98, 8.1, "Auth Request", ORANGE)

    ax.add_patch(FancyBboxPatch((0.3, 0.6), 15.2, 6.6,
                                boxstyle="round,pad=0.1,rounding_size=0.4",
                                linewidth=2.5, edgecolor="#4285F4",
                                facecolor="#030d1f", zorder=0))
    ax.text(8.0, 7.05, "GCP VPC  (Isolated Network)",
            ha="center", va="center", color="#4285F4",
            fontsize=10, fontweight="bold", alpha=0.8)
    ax.text(8.0, 6.75, "Ingress / Egress Firewall Rules  (Min Privilege)",
            ha="center", va="center", color=GRAY, fontsize=8.5, style="italic")
    ax.plot([0.5, 15.5], [6.6, 6.6], color=BORDER, lw=1.2, ls="--", alpha=0.6)

    ax.add_patch(FancyBboxPatch((0.6, 3.5), 7.0, 2.8,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=1.5, edgecolor=TEAL,
                                facecolor="#0a1e20", zorder=1))
    ax.text(4.1, 6.12, "Public Subnet",
            ha="center", va="center", color=TEAL, fontsize=9, fontweight="bold")
    box(ax, 0.8, 4.7, 3.0, 1.2, "Token Service", "FastAPI · JWT Signing",
        color=BLUE, bg="#0a1628", fontsize=10)
    box(ax, 4.5, 4.7, 2.8, 1.2, "WebRTC Server", "LiveKit · UDP / SRTP",
        color=TEAL, bg=CARD, fontsize=10)

    arrow(ax, 4.45, 8.1, 3.65, 6.0, "JWT Token", BLUE)
    arrow(ax, 3.82, 5.3, 4.48, 5.3, "token", TEAL2)
    ax.text(3.2, 3.7, "WebRTC / UDP (media stream)",
            ha="center", va="center", color=TEAL, fontsize=7.5, style="italic")

    ax.add_patch(FancyBboxPatch((8.2, 3.5), 7.0, 2.8,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=1.5, edgecolor=PURPLE,
                                facecolor="#160d2a", zorder=1))
    ax.text(11.7, 6.12, "Private Subnet",
            ha="center", va="center", color=PURPLE, fontsize=9, fontweight="bold")
    box(ax, 8.5, 4.5, 6.5, 1.6, "AI Agent Backend",
        "LLM Processing · Task Scheduling · Internal APIs",
        color=PURPLE, bg="#1a0a2e", fontsize=11)
    arrow(ax, 7.62, 5.2, 8.48, 5.2, "Internal API", PURPLE)

    box(ax, 0.8, 1.0, 4.5, 1.8, "Ansible IaC",
        "Multi-env Deployment · Idempotent Playbooks",
        color=GREEN, bg="#0a1a0f", fontsize=10)
    ax.text(3.05, 0.75, "Dev / Staging / Production",
            ha="center", va="center", color=GRAY, fontsize=7.5)
    arrow(ax, 3.05, 2.82, 2.3,  3.48, color=GREEN)
    arrow(ax, 3.05, 2.82, 5.9,  3.48, color=GREEN)
    arrow(ax, 3.05, 2.82, 11.7, 3.48, color=GREEN)

    box(ax, 11.0, 1.0, 4.3, 2.2, "GCP Services",
        "Cloud Compute · VPC · IAM · Firewall",
        color="#4285F4", bg="#0a1020", fontsize=10)
    for i, t in enumerate(["Compute Engine", "Cloud VPC", "Cloud IAM", "Firebase"]):
        tag(ax, 11.4 + (i % 2) * 2.0, 1.5 - (i // 2) * 0.55, t, "#4285F4")

    plt.tight_layout(pad=0.5)
    _save(fig, "gcp-livekit-infra")


def draw_stock_mlops():
    fig, ax = fig_setup()
    title_bar(ax, "Stock Price Prediction  —  MLOps Architecture",
              "Prefect · MLflow · FastAPI · Celery · Kafka · Prometheus · Grafana · Docker")

    # Data Ingestion
    section_label(ax, 0.4, 8.85, 4.0, "DATA INGESTION", ORANGE)
    box(ax, 0.5, 7.5, 3.5, 0.9, "Market Data API", "Yahoo Finance / Alpha Vantage",
        color=ORANGE, bg="#2a1400", fontsize=10)
    box(ax, 0.5, 6.2, 3.5, 0.9, "Kafka Topic", "raw_stock_data stream",
        color=YELLOW, bg="#1a1500", fontsize=10)
    arrow(ax, 2.25, 7.48, 2.25, 7.12, color=ORANGE)

    # Prefect Pipeline
    ax.add_patch(FancyBboxPatch((4.5, 5.3), 7.0, 3.4,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=TEAL, facecolor="#0a1e20"))
    ax.text(8.0, 8.5, "Prefect  —  Pipeline Orchestration",
            ha="center", va="center", color=TEAL, fontsize=12, fontweight="bold")
    for i, (lab, sub, c) in enumerate([
        ("ETL Flow",      "Fetch · clean · store",     ORANGE),
        ("Feature Flow",  "Technical indicators · lag", BLUE),
        ("Train Flow",    "Celery async training",      PURPLE),
        ("Predict Flow",  "Batch prediction · cache",   GREEN),
    ]):
        bx = 4.7 + (i % 2) * 3.4
        by = 6.2 - (i // 2) * 0.9
        box(ax, bx, by, 3.1, 0.75, lab, sub, color=c, bg=PANEL, fontsize=9)
    arrow(ax, 2.25, 6.18, 4.48, 7.2, color=YELLOW)

    # Storage layer
    section_label(ax, 0.4, 4.95, 4.0, "STORAGE", BLUE)
    box(ax, 0.5, 3.8, 1.7, 0.9, "PostgreSQL", "OHLCV · features", color=BLUE, bg="#0a1628", fontsize=9)
    box(ax, 2.4, 3.8, 1.7, 0.9, "ClickHouse", "Time-series OLAP",  color=TEAL, bg=CARD, fontsize=9)
    box(ax, 0.5, 2.6, 1.7, 0.9, "MinIO",      "Model artifacts",   color=ORANGE, bg="#2a1400", fontsize=9)
    box(ax, 2.4, 2.6, 1.7, 0.9, "MLflow",     "Experiments · runs",color=PURPLE, bg="#160d2a", fontsize=9)
    arrow(ax, 8.0, 5.28, 2.25, 4.72, color=TEAL)

    # FastAPI
    box(ax, 4.5, 3.5, 3.5, 1.6, "FastAPI",
        "/predict · /train · /models\n/history · /metrics",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    arrow_lr(ax, 4.0, 4.0, 4.48, 4.0, color=GREEN)

    # Celery Workers
    box(ax, 4.5, 1.8, 3.5, 1.3, "Celery Workers",
        "Async model training\nBatch prediction jobs",
        color=ORANGE, bg="#2a1000", fontsize=10)
    arrow(ax, 6.25, 3.48, 6.25, 3.12, color=ORANGE)

    # Monitoring
    section_label(ax, 8.4, 8.85, 7.2, "MONITORING & CI/CD", RED)
    box(ax, 8.5, 7.5, 3.0, 0.9, "Prometheus", "Metrics scraping",   color=ORANGE, bg="#2a1000", fontsize=10)
    box(ax, 12.0, 7.5, 3.3, 0.9, "Grafana",   "Dashboards · alerts",color=ORANGE, bg="#2a1000", fontsize=10)
    box(ax, 8.5, 6.2, 3.0, 0.9, "Evidently",  "Data / model drift", color=RED, bg="#2a0a0a", fontsize=10)
    box(ax, 12.0, 6.2, 3.3, 0.9, "GitHub Actions", "CI/CD pipeline", color=BLUE, bg="#0a1020", fontsize=10)
    arrow(ax, 11.52, 7.95, 11.98, 7.95, color=ORANGE)
    arrow(ax, 8.0,   5.28, 10.0,  6.45, color=RED)

    box(ax, 8.5, 4.0, 3.0, 1.8, "React Frontend",
        "Prediction chart\nHistory · metrics",
        color=TEAL, bg=CARD, fontsize=10)
    arrow_lr(ax, 8.02, 4.5, 8.48, 4.5, color=TEAL)

    ax.text(8.0, 0.4,
            "Docker Compose · GitHub Actions · Redis (broker) · PostgreSQL · ClickHouse · MinIO",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "stock-mlops")


def draw_llm_assistance():
    fig, ax = fig_setup()
    title_bar(ax, "AI Research Curator  —  RAG System Architecture",
              "FastAPI · Prefect · Qdrant · MinIO · LangChain · React · Ollama")

    # Data ingestion
    section_label(ax, 0.4, 8.85, 4.5, "DAILY INGESTION", ORANGE)
    box(ax, 0.5, 7.5, 4.0, 0.9, "arXiv API",   "Daily paper feed",  color=ORANGE, bg="#2a1400", fontsize=10)
    box(ax, 0.5, 6.3, 4.0, 0.9, "Prefect Flow", "Schedule · retry · monitor", color=TEAL, bg=CARD, fontsize=10)
    arrow(ax, 2.5, 7.48, 2.5, 7.22, color=ORANGE)

    # Processing pipeline
    ax.add_patch(FancyBboxPatch((0.4, 3.4), 4.6, 2.6,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=BLUE, facecolor="#0a1628"))
    ax.text(2.7, 5.76, "Processing Pipeline",
            ha="center", va="center", color=BLUE, fontsize=11, fontweight="bold")
    for i, (lab, c) in enumerate([
        ("PDF Download → MinIO",         ORANGE),
        ("Text Extraction · Chunking",   BLUE),
        ("Embedding (Ollama/nomic)",     PURPLE),
        ("Vector Upsert → Qdrant",       TEAL),
    ]):
        ax.text(0.7, 5.35 - i * 0.5, f"→ {lab}", ha="left", va="center",
                color=c, fontsize=9)
    arrow(ax, 2.5, 6.28, 2.5, 6.02, color=TEAL)

    # Storage
    section_label(ax, 0.4, 3.15, 4.6, "STORAGE", GRAY)
    box(ax, 0.5, 1.8, 2.0, 1.0, "Qdrant",      "Vector index",   color=PURPLE, bg="#160d2a", fontsize=9)
    box(ax, 2.8, 1.8, 2.0, 1.0, "MinIO",       "PDF / assets",   color=ORANGE, bg="#2a1400", fontsize=9)
    box(ax, 0.5, 0.6, 2.0, 1.0, "PostgreSQL",  "Metadata · history", color=BLUE, bg="#0a1628", fontsize=9)
    box(ax, 2.8, 0.6, 2.0, 1.0, "Prometheus",  "Metrics",        color=RED, bg="#2a0a0a", fontsize=9)
    arrow(ax, 2.7, 3.4, 1.8, 2.82, color=PURPLE)
    arrow(ax, 2.7, 3.4, 3.5, 2.82, color=ORANGE)

    # FastAPI backend
    ax.add_patch(FancyBboxPatch((5.4, 1.2), 5.2, 7.5,
                                boxstyle="round,pad=0.1,rounding_size=0.4",
                                linewidth=2, edgecolor=GREEN, facecolor="#0a1a0a",
                                alpha=0.3))
    ax.text(8.0, 8.5, "FastAPI Backend",
            ha="center", va="center", color=GREEN, fontsize=12, fontweight="bold")
    for i, (ep, sub, c) in enumerate([
        ("POST /search",    "Semantic / keyword query", TEAL),
        ("POST /rag/ask",   "RAG Q&A with Ollama LLM",  PURPLE),
        ("GET  /papers",    "List · filter · paginate",  BLUE),
        ("POST /subscribe", "Email subscription mgmt",   ORANGE),
        ("GET  /stats",     "Analytics · topic trends",  GREEN),
    ]):
        box(ax, 5.6, 7.2 - i * 1.15, 4.8, 0.85, ep, sub,
            color=c, bg=PANEL, fontsize=9)

    # LLM
    box(ax, 5.6, 1.4, 4.8, 1.3, "Ollama (local LLM)",
        "llama3 · nomic-embed · RAG chain",
        color=PURPLE, bg="#160d2a", fontsize=10)
    arrow(ax, 8.0, 2.95, 8.0, 2.72, color=PURPLE)

    # Frontend
    section_label(ax, 11.2, 8.85, 4.4, "REACT DASHBOARD", TEAL)
    for i, (lab, sub, c) in enumerate([
        ("Search Interface", "Dual-lang · semantic",     TEAL),
        ("Paper Detail",     "Abstract · authors · PDF", BLUE),
        ("RAG Chat",         "Ask about papers",         PURPLE),
        ("Subscriptions",    "Email topic alerts",       ORANGE),
        ("Statistics",       "Charts · topic trends",    GREEN),
    ]):
        box(ax, 11.3, 7.5 - i * 1.25, 4.2, 0.95, lab, sub,
            color=c, bg=PANEL, fontsize=9)

    arrow_lr(ax, 10.62, 5.5, 11.28, 5.5, color=TEAL)

    ax.text(8.0, 0.35,
            "Docker Compose · Prefect · Qdrant · MinIO · PostgreSQL · Ollama · Prometheus + Grafana",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "llm-assistance")


def draw_de():
    fig, ax = fig_setup()
    title_bar(ax, "GitHub Data Analysis Pipeline  —  Architecture",
              "Terraform · GCP · BigQuery · PySpark · Airflow · dbt · Streamlit")

    # Source
    box(ax, 0.5, 7.5, 3.0, 1.0, "GitHub API", "REST · GraphQL · Events",
        color="#6e5494", bg="#1a1030", fontsize=10)
    ax.text(2.0, 7.2, "Repos · Stars · PRs\nLanguages · Commits",
            ha="center", va="center", color=GRAY, fontsize=7.5)

    # Terraform IaC
    box(ax, 0.5, 5.8, 3.0, 1.0, "Terraform IaC",
        "GCS bucket · BigQuery\ndataset provisioning",
        color=PURPLE, bg="#160d2a", fontsize=10)
    arrow(ax, 2.0, 7.48, 2.0, 6.82, color="#6e5494")

    # Raw landing
    box(ax, 4.2, 7.5, 3.0, 1.0, "GCS Raw Zone",
        "Parquet files · partitioned",
        color=ORANGE, bg="#2a1400", fontsize=10)
    arrow(ax, 3.52, 8.0, 4.18, 8.0, "extract", ORANGE)

    # PySpark
    ax.add_patch(FancyBboxPatch((4.0, 4.8), 3.5, 2.4,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=BLUE, facecolor="#0a1628"))
    ax.text(5.75, 6.98, "PySpark (Dataproc)",
            ha="center", va="center", color=BLUE, fontsize=11, fontweight="bold")
    for i, step in enumerate(["Schema validation", "Dedup & clean",
                               "Join / aggregate", "Write Parquet"]):
        ax.text(4.2, 6.6 - i * 0.42, f"• {step}", ha="left", va="center",
                color=GRAY, fontsize=8.5)
    arrow(ax, 5.7, 7.48, 5.7, 7.22, color=BLUE)

    # Airflow orchestration
    ax.add_patch(FancyBboxPatch((4.0, 3.2), 3.5, 1.38,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=ORANGE, facecolor="#1a1000"))
    ax.text(5.75, 4.36, "Airflow  —  Weekly DAG",
            ha="center", va="center", color=ORANGE, fontsize=11, fontweight="bold")
    for i, (s, c) in enumerate([
        ("fetch_github", ORANGE), ("spark_transform", BLUE),
        ("dbt_run",      GREEN),  ("refresh_streamlit", TEAL),
    ]):
        box(ax, 4.1 + (i % 2) * 1.72, 3.28 + (i // 2) * 0.64,
            1.55, 0.52, s, color=c, bg=PANEL, fontsize=7)
    arrow(ax, 5.75, 4.78, 5.75, 4.6, color=ORANGE)

    # BigQuery
    ax.add_patch(FancyBboxPatch((8.2, 4.0), 4.0, 4.2,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor="#4285F4", facecolor="#0a1020"))
    ax.text(10.2, 7.98, "BigQuery  —  Data Warehouse",
            ha="center", va="center", color="#4285F4", fontsize=12, fontweight="bold")
    for i, (schema, tables) in enumerate([
        ("raw",      "github_events, repos"),
        ("staging",  "stg_repos, stg_prs"),
        ("mart",     "top_repos, lang_trends"),
    ]):
        box(ax, 8.4, 6.8 - i * 1.1, 3.6, 0.82,
            f"{schema}.*", tables, color="#4285F4", bg=PANEL, fontsize=9)

    arrow(ax, 5.52, 3.9, 8.18, 6.2, color=BLUE)
    arrow(ax, 7.52, 7.0, 8.18, 7.0, color=ORANGE)

    # dbt
    box(ax, 8.2, 2.5, 4.0, 1.2, "dbt (transformations)",
        "models · tests · docs · lineage",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    arrow(ax, 10.2, 3.98, 10.2, 3.72, color=GREEN)

    # Streamlit
    box(ax, 8.2, 0.8, 4.0, 1.4, "Streamlit Dashboard",
        "Language trends · star growth\nTop repos · PR activity",
        color=TEAL, bg=CARD, fontsize=10)
    arrow(ax, 10.2, 2.48, 10.2, 2.22, color=TEAL)

    # GCP sidebar
    box(ax, 12.8, 5.5, 2.8, 3.0, "GCP Services",
        "Dataproc · GCS\nBigQuery · IAM\nCloud Composer",
        color="#4285F4", bg="#0a1020", fontsize=9)

    ax.text(8.0, 0.35,
            "Terraform · GCP Dataproc · Cloud Storage · BigQuery · dbt · Airflow · PySpark · Streamlit",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "de", "streamlit.png")


def draw_monitoring_system():
    fig, ax = fig_setup()
    title_bar(ax, "Monitoring System  —  Observability Architecture",
              "Prometheus · Grafana · AlertManager · Docker Compose")

    # Target services
    section_label(ax, 0.4, 8.85, 4.5, "TARGET SERVICES", GRAY)
    for i, (svc, port) in enumerate([
        ("FastAPI Service",  ":8000/metrics"),
        ("Node Exporter",    ":9100  (host OS)"),
        ("cAdvisor",         ":8080  (containers)"),
        ("Custom Exporter",  ":9200  (app KPIs)"),
    ]):
        box(ax, 0.5, 7.5 - i * 1.05, 3.8, 0.82, svc, port,
            color=GRAY, bg=PANEL, fontsize=9)
    ax.text(2.4, 3.2, "HTTP /metrics endpoints\n(Prometheus exposition format)",
            ha="center", va="center", color=GRAY, fontsize=8)

    # Prometheus
    box(ax, 5.2, 6.8, 4.0, 1.4, "Prometheus",
        "Scrape · TSDB · PromQL\nRetention: 15d",
        color=ORANGE, bg="#2a1000", fontsize=11)
    for i in range(4):
        arrow(ax, 4.32, 7.91 - i * 1.05, 5.18, 7.4, color=ORANGE)

    # AlertManager
    box(ax, 5.2, 4.8, 4.0, 1.5, "AlertManager",
        "Route · group · dedupe\nSilence · inhibit",
        color=RED, bg="#2a0a0a", fontsize=11)
    arrow(ax, 7.2, 6.78, 7.2, 6.32, color=RED)

    # Notification channels
    for i, (chan, sub, c) in enumerate([
        ("Slack",  "#alerts channel", PURPLE),
        ("Email",  "SMTP relay",      BLUE),
        ("PagerDuty", "On-call",      RED),
    ]):
        box(ax, 5.2 + i * 1.42, 3.1, 1.2, 1.4, chan, sub,
            color=c, bg=PANEL, fontsize=8)
        arrow(ax, 6.5 + (i - 1) * 1.42, 4.78,
              5.8 + i * 1.42, 4.52, color=c)

    # Grafana
    box(ax, 10.3, 6.5, 5.0, 2.0, "Grafana",
        "Dashboards · panels · alerts",
        color=ORANGE, bg="#2a1000", fontsize=11)
    ax.text(12.8, 7.0,
            "• System Overview\n• Container Metrics\n• App KPI\n• SLO / SLA",
            ha="left", va="center", color=GRAY, fontsize=8.5)
    arrow_lr(ax, 9.22, 7.5, 10.28, 7.5, "PromQL queries", ORANGE)

    # Rules
    box(ax, 10.3, 4.8, 5.0, 1.4, "Alert Rules (YAML)",
        "CPU > 80%  ·  Error rate > 1%\nMemory > 90%  ·  Latency > 500ms",
        color=RED, bg="#2a0a0a", fontsize=10)
    arrow(ax, 9.22, 5.5, 10.28, 5.5, "rules", RED)

    # Docker
    ax.add_patch(FancyBboxPatch((0.3, 0.5), 15.2, 2.3,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=BLUE, facecolor="#0a1020",
                                alpha=0.4))
    ax.text(8.0, 2.55, "Docker Compose Stack",
            ha="center", va="center", color=BLUE, fontsize=10, fontweight="bold")
    for i, svc in enumerate(["prometheus", "grafana", "alertmanager",
                              "node-exporter", "cadvisor", "app"]):
        tag(ax, 1.4 + i * 2.2, 1.6, svc, BLUE)
    ax.text(8.0, 0.85, "Volumes: prometheus_data · grafana_data  |  Networks: monitoring-net",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "monitoring-system")


def draw_clothes():
    fig, ax = fig_setup()
    title_bar(ax, "Color-based Outfit Recommendation  —  System Architecture",
              "Python · FastAPI · MySQL · Redis · Docker · React")

    # Input
    box(ax, 0.5, 7.5, 3.5, 1.0, "User Input",
        "Style preference · color seed",
        color=TEAL, bg=CARD, fontsize=10)

    # Web scraping
    box(ax, 0.5, 5.9, 3.5, 1.2, "Web Scraper",
        "Pinterest · Instagram\nPublic outfit datasets",
        color=ORANGE, bg="#2a1400", fontsize=10)
    arrow(ax, 2.25, 7.48, 2.25, 7.12, color=TEAL)

    # Recommendation engine
    ax.add_patch(FancyBboxPatch((4.5, 4.5), 7.0, 4.2,
                                boxstyle="round,pad=0.1,rounding_size=0.4",
                                linewidth=2, edgecolor=PURPLE, facecolor="#160d2a"))
    ax.text(8.0, 8.5, "Recommendation Engine",
            ha="center", va="center", color=PURPLE, fontsize=12, fontweight="bold")

    for i, (lab, sub, c) in enumerate([
        ("Color Wheel Analysis",  "HSL / complementary theory", TEAL),
        ("Style Classifier",      "Minimalist/Industrial/Vintage…", BLUE),
        ("Outfit Matcher",        "Top × Bottom × Accessory sets",  PURPLE),
        ("Score & Rank",          "Confidence · diversity filter",  GREEN),
    ]):
        box(ax, 4.7, 7.6 - i * 0.82, 6.6, 0.65, lab, sub,
            color=c, bg=PANEL, fontsize=9)

    arrow(ax, 2.25, 7.48, 4.48, 7.8, color=TEAL)
    arrow(ax, 2.25, 5.88, 4.48, 6.3, color=ORANGE)

    # FastAPI
    box(ax, 4.5, 2.8, 3.2, 1.4, "FastAPI",
        "POST /recommend\nGET  /styles\nGET  /outfits/:id",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    arrow(ax, 8.0, 4.48, 6.8, 4.22, color=GREEN)

    # Storage
    box(ax, 4.5, 1.0, 1.4, 1.5, "MySQL",
        "Outfits\nColors\nUsers",
        color=BLUE, bg="#0a1628", fontsize=9)
    box(ax, 6.2, 1.0, 1.4, 1.5, "Redis",
        "Session\nCache\n30 min TTL",
        color=RED, bg="#2a0a0a", fontsize=9)
    arrow(ax, 6.1, 2.78, 5.5, 2.52, color=BLUE)
    arrow(ax, 6.1, 2.78, 6.9, 2.52, color=RED)

    # React frontend
    box(ax, 12.0, 6.5, 3.5, 2.0, "React Frontend",
        "Color picker UI\nOutfit gallery\nStyle selector",
        color=TEAL, bg=CARD, fontsize=10)
    arrow_lr(ax, 7.72, 4.0, 11.98, 7.5, color=TEAL)

    # Docker
    box(ax, 12.0, 4.0, 3.5, 2.0, "Docker Compose",
        "fastapi · mysql\nredis · react\nnginx reverse proxy",
        color=BLUE, bg="#0a1020", fontsize=10)

    ax.text(8.0, 0.4,
            "FastAPI · MySQL · Redis · React · Docker Compose · Pandas · Scikit-learn",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "clothes")


def draw_aidc():
    fig, ax = fig_setup()
    title_bar(ax, "AI Defect Detection Platform  —  System Architecture",
              "Python · Flask · YOLO · MySQL · Redis · Docker Compose")

    box(ax, 0.5, 7.5, 3.0, 0.9, "Industrial Camera",
        "Production line sensor",
        color=ORANGE, bg="#2a1400", fontsize=10)
    box(ax, 0.5, 6.2, 3.0, 0.9, "Image Preprocessor",
        "Resize · Normalize · Augment",
        color=ORANGE, bg="#2a1000", fontsize=10)
    arrow(ax, 2.0, 7.48, 2.0, 7.12, color=ORANGE)

    section_label(ax, 4.3, 8.85, 7.4, "AI INFERENCE ENGINE", RED)
    ax.add_patch(FancyBboxPatch((4.2, 3.3), 7.6, 5.35,
                                boxstyle="round,pad=0.1,rounding_size=0.4",
                                linewidth=2, edgecolor=RED, facecolor="#2a0a0a",
                                alpha=0.25))
    box(ax, 4.4, 7.4, 3.4, 1.1, "Object Detection",
        "YOLO · localize defects",
        color=RED, bg="#2a0a0a", fontsize=10)
    box(ax, 8.2, 7.4, 3.4, 1.1, "Image Classification",
        "CNN · defect type label",
        color=PURPLE, bg="#160d2a", fontsize=10)
    arrow(ax, 3.52, 6.65, 4.38, 7.8, color=ORANGE)
    arrow(ax, 7.82, 7.95, 8.18, 7.95, "ensemble", RED)

    box(ax, 5.5, 5.9, 4.8, 1.0, "Result Aggregator",
        "Bounding box · confidence · defect class",
        color=RED, bg="#1a0808", fontsize=10)
    arrow(ax, 6.1, 7.38, 6.5, 6.92, color=RED)
    arrow(ax, 9.9, 7.38, 9.0, 6.92, color=PURPLE)

    ax.add_patch(FancyBboxPatch((4.4, 3.5), 7.2, 2.1,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=1.5, edgecolor=YELLOW,
                                facecolor="#1a1500", alpha=0.5))
    ax.text(8.0, 5.38, "Model Training Pipeline",
            ha="center", va="center", color=YELLOW, fontsize=11, fontweight="bold")
    for i, (lab, sub, c) in enumerate([
        ("Dataset Prep", "Annotation · split", ORANGE),
        ("Train / Val",  "Epoch tracking",     YELLOW),
        ("Checkpoint",   ".pt model file",     TEAL),
        ("Evaluation",   "mAP · F1 score",     GREEN),
    ]):
        box(ax, 4.6 + i * 1.82, 3.62, 1.62, 1.5, lab, sub,
            color=c, bg=PANEL, fontsize=8)
    arrow(ax, 7.8, 5.88, 7.8, 5.52, color=YELLOW)

    section_label(ax, 0.4, 2.85, 4.0, "BACKEND & STORAGE", BLUE)
    box(ax, 0.5, 1.8, 3.5, 0.9, "Flask REST API",
        "POST /detect · GET /results",
        color=BLUE, bg="#0a1020", fontsize=10)
    box(ax, 0.5, 0.6, 1.5, 0.9, "MySQL",  "Results · history", color=TEAL, bg=CARD, fontsize=9)
    box(ax, 2.3, 0.6, 1.5, 0.9, "Redis Cache", "Hot data · queue", color=RED, bg="#2a0a0a", fontsize=9)
    arrow(ax, 2.25, 1.78, 2.25, 5.88, color=BLUE)
    arrow(ax, 1.25, 1.78, 1.25, 1.52, color=TEAL)
    arrow(ax, 3.05, 1.78, 3.05, 1.52, color=RED)

    section_label(ax, 12.1, 8.85, 3.5, "WEB DASHBOARD", GREEN)
    box(ax, 12.2, 7.4, 3.2, 1.0, "Inspection Dashboard", "Real-time defect viewer",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    box(ax, 12.2, 5.9, 3.2, 1.0, "Training Monitor UI", "Loss curve · accuracy",
        color=YELLOW, bg="#1a1500", fontsize=10)
    box(ax, 12.2, 4.4, 3.2, 1.0, "Report Export", "PDF / CSV defect logs",
        color=TEAL, bg=CARD, fontsize=10)
    box(ax, 12.2, 2.9, 3.2, 1.0, "Alert System", "Threshold trigger · notify",
        color=RED, bg="#2a0a0a", fontsize=10)
    arrow(ax, 11.82, 6.4,  12.18, 7.65, color=GREEN)
    arrow(ax, 11.82, 5.4,  12.18, 6.15, color=YELLOW)
    arrow(ax, 3.72,  2.25, 12.18, 3.3,  color=RED)

    ax.text(8.0, 0.35,
            "Docker Compose · Flask · MySQL · Redis · PyTorch · YOLO · Nginx",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "aidc")


def draw_amd():
    fig, ax = fig_setup()
    title_bar(ax, "AMD Rehabilitation Platform  —  System Architecture",
              "Unity3D · C# · SQLite · TensorRT · Ansible · NVIDIA CUDA")

    section_label(ax, 0.4, 8.85, 4.5, "PATIENT TRAINING FLOW", TEAL)
    box(ax, 0.5, 7.5, 4.0, 0.9, "Patient Login",
        "SQLite: user credentials & profile",
        color=TEAL, bg=CARD, fontsize=10)
    box(ax, 0.5, 6.0, 4.0, 1.1, "Training Session (Unity UI)",
        "Visual stimulus on eccentric position",
        color=TEAL2, bg=CARD, fontsize=10)
    ax.annotate("", xy=(2.5, 7.12), xytext=(2.5, 7.48),
                arrowprops=dict(arrowstyle="-|>", color=TEAL, lw=1.8, mutation_scale=16))

    ax.add_patch(FancyBboxPatch((0.4, 3.9), 4.6, 1.8,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=PURPLE, facecolor="#160d2a"))
    ax.text(2.7, 5.48, "Pupil Tracking Engine",
            ha="center", va="center", color=PURPLE, fontsize=12, fontweight="bold")
    for i, it in enumerate(["Virtual Webcam input", "TensorRT inference",
                             "Eye-position vector"]):
        ax.text(0.7, 5.05 - i * 0.32, f"• {it}", ha="left", va="center",
                color=GRAY, fontsize=8)
    ax.annotate("", xy=(2.7, 5.70), xytext=(2.7, 6.0),
                arrowprops=dict(arrowstyle="-|>", color=PURPLE, lw=1.8, mutation_scale=16))

    box(ax, 0.5, 2.4, 4.0, 1.1, "Session Results",
        "Accuracy · Response Time · Heatmap",
        color=ORANGE, bg="#2a1400", fontsize=10)
    ax.annotate("", xy=(2.5, 3.52), xytext=(2.5, 3.90),
                arrowprops=dict(arrowstyle="-|>", color=ORANGE, lw=1.8, mutation_scale=16))
    box(ax, 0.5, 1.0, 4.0, 1.0, "SQLite Database",
        "FundusImage · Logs · Training Records",
        color=YELLOW, bg="#1a1500", fontsize=10)
    ax.annotate("", xy=(2.5, 2.0), xytext=(2.5, 2.40),
                arrowprops=dict(arrowstyle="-|>", color=YELLOW, lw=1.8, mutation_scale=16))

    section_label(ax, 5.5, 8.85, 4.5, "NVIDIA GPU STACK", ORANGE)
    for i, (label, c, bg_c) in enumerate([
        ("NVIDIA Driver 535", GRAY,   "#1a1a1a"),
        ("CUDA Toolkit",      ORANGE, "#2a1400"),
        ("cuDNN",             ORANGE, "#2a1400"),
        ("TensorRT Engine",   RED,    "#2a0a0a"),
        ("OpenCV (Camera)",   GREEN,  "#0a1a0a"),
        ("Virtual Webcam\n(v4l2loopback)", BLUE, "#0a1020"),
    ]):
        yy = 7.6 - i * 1.06
        box(ax, 5.6, yy, 4.2, 0.82, label, color=c, bg=bg_c, fontsize=9)
        if i < 5:
            ax.annotate("", xy=(7.7, yy), xytext=(7.7, yy + 0.24),
                        arrowprops=dict(arrowstyle="-|>", color=c,
                                        lw=1.4, mutation_scale=14))
    ax.text(7.7, 1.6, "TensorRT .engine file\ndeployed via Ansible",
            ha="center", va="center", color=GRAY, fontsize=8,
            bbox=dict(boxstyle="round,pad=0.3", facecolor=PANEL, edgecolor=BORDER))
    ax.annotate("", xy=(5.02, 4.8), xytext=(5.58, 4.8),
                arrowprops=dict(arrowstyle="-|>", color=RED, lw=1.8, mutation_scale=16))
    ax.text(5.3, 5.0, "infer", ha="center", va="center", color=RED, fontsize=8)

    section_label(ax, 10.4, 8.85, 5.2, "ANSIBLE DEPLOYMENT", GREEN)
    box(ax, 10.5, 7.5, 4.8, 0.9, "Ansible Control (Local Dev)",
        "Playbooks · Inventory · common_vars.yml",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    for i, (s, d, c) in enumerate([
        ("① MoveRemoteSQL",  "Back up existing SQLite DB",    TEAL),
        ("② Build Unity App","Local compile (manual step)",   GRAY),
        ("③ cleanData.yml",  "Init DB schema & clear media",  YELLOW),
        ("④ Deploy.yml",     "rsync build → remote machines", BLUE),
        ("⑤ ReturnRemoteSQL","Restore DB to StreamingAssets", TEAL2),
        ("⑥ CopyTRTfile",    "Push TensorRT .engine file",    RED),
    ]):
        box(ax, 10.5, 6.6 - i * 0.95, 4.8, 0.72, s, d,
            color=c, bg=PANEL, fontsize=9)
    box(ax, 10.5, 0.9, 2.0, 0.9, "Dev Machine",  "192.168.15.165", color=TEAL,  bg=CARD, fontsize=9)
    box(ax, 13.2, 0.9, 2.0, 0.9, "Prod Machine", "192.168.15.29",  color=GREEN, bg=CARD, fontsize=9)
    ax.annotate("", xy=(11.5, 1.82), xytext=(12.25, 2.4),
                arrowprops=dict(arrowstyle="-|>", color=GREEN, lw=1.6, mutation_scale=14))
    ax.annotate("", xy=(14.2, 1.82), xytext=(12.95, 2.4),
                arrowprops=dict(arrowstyle="-|>", color=GREEN, lw=1.6, mutation_scale=14))

    ax.text(8.0, 0.35,
            "Unity3D (C#) · Shell Scripts · SQLite · Ansible · NVIDIA CUDA · TensorRT · OpenCV",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "amd")


def draw_backup_start_up():
    fig, ax = fig_setup()
    title_bar(ax, "Monthly Stand-Up Backup  —  Pipeline Architecture",
              "Apache Airflow · Python · PostgreSQL · Docker Compose")

    section_label(ax, 0.4, 8.85, 4.5, "DATA SOURCES", GRAY)
    box(ax, 0.5, 7.4, 2.0, 1.0, "Chat / Slack", "Stand-Up messages",
        color=PURPLE, bg="#160d2a", fontsize=10)
    box(ax, 3.0, 7.4, 2.0, 1.0, "Meeting Notes", "Markdown / text files",
        color=BLUE, bg="#0a1020", fontsize=10)
    box(ax, 5.5, 7.4, 2.2, 1.0, "Calendar API", "Monthly schedule",
        color=ORANGE, bg="#2a1400", fontsize=10)

    box(ax, 1.5, 5.8, 5.5, 1.0, "Python Collector Script",
        "Parse · Normalize · Format records",
        color=TEAL, bg=CARD, fontsize=11)
    arrow(ax, 1.5, 7.38, 3.0, 6.82, color=PURPLE)
    arrow(ax, 4.0, 7.38, 4.0, 6.82, color=BLUE)
    arrow(ax, 6.6, 7.38, 5.7, 6.82, color=ORANGE)

    section_label(ax, 0.4, 5.55, 9.5, "AIRFLOW ORCHESTRATION", ORANGE)
    ax.add_patch(FancyBboxPatch((0.4, 2.9), 9.5, 2.4,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=ORANGE, facecolor="#1a1000"))
    ax.text(5.15, 5.08, "Apache Airflow  —  DAG Scheduler",
            ha="center", va="center", color=ORANGE, fontsize=12, fontweight="bold")
    for i, (name, schedule, desc, c) in enumerate([
        ("monthly_collect_dag", "Every 1st of month", "Collect records",   TEAL),
        ("monthly_backup_dag",  "Every 1st of month", "Transform & save",  BLUE),
        ("cleanup_dag",         "Monthly retention",  "Purge old logs",    RED),
    ]):
        box(ax, 0.6 + i * 3.12, 3.0, 2.9, 1.6, name,
            f"{schedule}\n{desc}", color=c, bg=PANEL, fontsize=9)
    arrow(ax, 4.25, 5.78, 4.25, 5.32, color=ORANGE)

    ax.add_patch(FancyBboxPatch((0.4, 1.1), 9.5, 1.55,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=BLUE, facecolor="#0a1628"))
    ax.text(5.15, 2.43, "PostgreSQL  —  Backup Storage",
            ha="center", va="center", color=BLUE, fontsize=12, fontweight="bold")
    for i, t in enumerate(["standup_records", "monthly_summary", "audit_logs", "team_members"]):
        tag(ax, 1.3 + i * 2.2, 1.55, t, BLUE)
    arrow(ax, 4.25, 2.9, 4.25, 2.67, color=BLUE)

    section_label(ax, 10.4, 8.85, 5.2, "DOCKER COMPOSE STACK", GREEN)
    for i, (svc, port, c) in enumerate([
        ("airflow-webserver", ":8080",       ORANGE),
        ("airflow-scheduler", "cron trigger",ORANGE),
        ("postgres",          ":5432",       BLUE),
        ("airflow-worker",    "task executor",TEAL),
    ]):
        box(ax, 10.5, 7.7 - i * 1.1, 4.8, 0.82, svc, port,
            color=c, bg=PANEL, fontsize=10)
    ax.add_patch(FancyBboxPatch((10.3, 3.2), 5.2, 3.8,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=1.5, edgecolor=GREEN,
                                facecolor=GREEN, alpha=0.05))
    ax.text(12.9, 6.85, "docker-compose.yml",
            ha="center", va="center", color=GREEN, fontsize=9, fontweight="bold")
    box(ax, 10.5, 2.2, 4.8, 0.8, "Docker Volumes",
        "postgres_data · airflow_logs · dags/",
        color=GRAY, bg=PANEL, fontsize=9)
    box(ax, 10.5, 1.0, 4.8, 0.9, "Email / Slack Alert",
        "On DAG failure · Monthly summary report",
        color=YELLOW, bg="#1a1500", fontsize=9)
    ax.annotate("", xy=(12.9, 1.92), xytext=(12.9, 2.20),
                arrowprops=dict(arrowstyle="-|>", color=YELLOW, lw=1.6, mutation_scale=14))

    ax.text(8.0, 0.45,
            "Python 3 · Apache Airflow · PostgreSQL · Docker Compose · SMTP / Slack Webhook",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "backup-start-up")


def draw_rm2():
    fig, ax = fig_setup()
    title_bar(ax, "Remote Meeting Prototype  —  System Architecture",
              "Unity3D · C# · Azure Speech-to-Text · REST API · Cross-platform")

    section_label(ax, 0.4, 8.85, 3.0, "PARTICIPANTS", TEAL)
    box(ax, 0.5, 7.5, 2.5, 0.9, "User A  (Host)",   "PCVR / Desktop / Mobile",       color=TEAL,  bg=CARD)
    box(ax, 0.5, 6.2, 2.5, 0.9, "User B  (Guest)",  "Different language / device",   color=TEAL2, bg=CARD)

    section_label(ax, 3.9, 8.85, 8.0, "UNITY CLIENT (C#)", PURPLE)
    ax.add_patch(FancyBboxPatch((3.8, 2.5), 8.2, 6.2,
                                boxstyle="round,pad=0.1,rounding_size=0.4",
                                linewidth=2, edgecolor=PURPLE,
                                facecolor="#160d2a", alpha=0.4))
    for bx, by, bw, bh, label, sublabel, c in [
        (4.0,  7.0, 3.6, 1.0, "Audio Capture",     "Microphone · WebRTC stream",    TEAL),
        (8.1,  7.0, 3.6, 1.0, "Meeting Room UI",   "Unity scene · 3D objects",      PURPLE),
        (4.0,  5.5, 3.6, 1.1, "Real-time Subtitles","Display recognized text",       BLUE),
        (8.1,  5.5, 3.6, 1.1, "Emoji Reactions",   "Instant emoji broadcast",       ORANGE),
        (4.0,  4.0, 3.6, 1.1, "Meeting Objects",   "Whiteboard · Files · Notes",    TEAL2),
        (8.1,  4.0, 3.6, 1.1, "Meeting Log Writer","Timestamped transcript",        GREEN),
        (4.0,  2.7, 7.7, 0.9, "Cross-platform Layer",
         "Unity  ·  Windows / Mac / PCVR (Meta Quest 3) / Mobile", GRAY),
    ]:
        box(ax, bx, by, bw, bh, label, sublabel, color=c, bg=PANEL, fontsize=9)

    arrow(ax, 5.8, 7.0, 5.8, 6.62, color=TEAL)
    arrow(ax, 9.9, 7.0, 9.9, 6.62, color=PURPLE)
    arrow(ax, 5.8, 5.5, 5.8, 5.12, color=BLUE)
    arrow(ax, 9.9, 5.5, 9.9, 5.12, color=ORANGE)
    arrow(ax, 3.02, 7.95, 3.98, 7.5,  color=TEAL)
    arrow(ax, 3.02, 6.65, 3.98, 5.8,  color=TEAL2)
    arrow_lr(ax, 3.02, 7.3, 3.98, 7.0, color=TEAL)

    section_label(ax, 0.4, 2.35, 3.0, "CLOUD SERVICES", ORANGE)
    box(ax, 0.5, 0.9, 2.8, 1.2, "Azure Speech API",
        "Speech-to-Text (real-time)\nMulti-language support",
        color=BLUE, bg="#0a1020", fontsize=9)
    arrow_lr(ax, 3.32, 1.5, 3.98, 5.95, color=BLUE)
    ax.text(3.65, 3.8, "WebSocket\nStream", ha="center", va="center",
            color=BLUE, fontsize=7.5)

    box(ax, 12.5, 6.0, 3.2, 1.0, "REST API Backend",
        "Meeting objects · Session state",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    arrow_lr(ax, 11.72, 5.2, 12.48, 6.2, color=GREEN)
    ax.text(12.05, 5.65, "HTTP\nCRUD", ha="center", va="center",
            color=GREEN, fontsize=7.5)

    box(ax, 12.5, 4.5, 3.2, 1.0, "Local Storage",
        "Meeting records · Transcripts",
        color=YELLOW, bg="#1a1500", fontsize=10)
    arrow(ax, 14.1, 5.98, 14.1, 5.52, color=YELLOW)

    box(ax, 12.5, 3.0, 3.2, 1.0, "SignalR / WebSocket",
        "Real-time emoji & sync",
        color=TEAL, bg=CARD, fontsize=10)
    arrow_lr(ax, 11.72, 4.3, 12.48, 3.5, color=TEAL)

    ax.text(8.0, 0.4,
            "Unity3D · C# · Azure Cognitive Services · SignalR · REST API · PCVR / Meta Quest 3",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "rm2")


def draw_molrx():
    fig, ax = fig_setup()
    title_bar(ax, "MolRx — Molecular Simulation & Visualization",
              "Unity3D · C# · VR · Protein-Ligand Interaction · Drug Discovery")

    # Input data
    box(ax, 0.5, 7.5, 3.5, 1.0, "Molecular Data Files",
        ".pdb  ·  .sdf  ·  .mol2",
        color=TEAL, bg=CARD, fontsize=10)

    # Parser
    box(ax, 0.5, 6.0, 3.5, 1.0, "Molecule Parser (C#)",
        "Atom coords · bond graph · charge",
        color=BLUE, bg="#0a1020", fontsize=10)
    arrow(ax, 2.25, 7.48, 2.25, 7.02, color=TEAL)

    # 3D renderer
    ax.add_patch(FancyBboxPatch((4.5, 4.5), 7.0, 4.2,
                                boxstyle="round,pad=0.1,rounding_size=0.4",
                                linewidth=2, edgecolor=PURPLE, facecolor="#160d2a"))
    ax.text(8.0, 8.5, "Unity3D  —  3D Visualization Engine",
            ha="center", va="center", color=PURPLE, fontsize=12, fontweight="bold")

    for i, (lab, sub, c) in enumerate([
        ("Ball-and-Stick Model",  "Atom spheres · bond cylinders",       TEAL),
        ("Protein Surface",       "Mesh render · electrostatic map",     BLUE),
        ("Binding Site Highlight","Cavity detection · color overlay",    PURPLE),
        ("Interaction Lines",     "H-bonds · pi-stacking dashed lines",  ORANGE),
    ]):
        box(ax, 4.7, 7.8 - i * 0.78, 6.6, 0.6, lab, sub,
            color=c, bg=PANEL, fontsize=9)

    arrow(ax, 2.25, 5.98, 4.48, 7.2, color=BLUE)

    # VR interaction
    box(ax, 4.5, 2.8, 3.2, 1.4, "VR Interaction (C#)",
        "Grab · rotate · scale\nFocus highlight · undo",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    arrow(ax, 8.0, 4.48, 6.8, 4.22, color=GREEN)

    # Media capture
    box(ax, 4.5, 1.0, 3.2, 1.5, "Media Capture",
        "Screenshot (PNG)\nScreen recording (MP4)\nTimestamped session log",
        color=ORANGE, bg="#2a1400", fontsize=10)
    arrow(ax, 6.1, 2.78, 6.1, 2.52, color=ORANGE)

    # Right: VR platform + UI
    box(ax, 12.0, 7.0, 3.5, 1.8, "VR Platform",
        "Meta Quest 3\nOculus PC VR\nOpenXR standard",
        color=TEAL, bg=CARD, fontsize=10)

    box(ax, 12.0, 4.8, 3.5, 1.8, "UI Controls",
        "View angle switch\nZoom in / out\nAtom label toggle\nClip plane",
        color=BLUE, bg="#0a1020", fontsize=10)
    arrow_lr(ax, 11.52, 7.5, 11.98, 7.5, color=TEAL)
    arrow_lr(ax, 11.52, 5.5, 11.98, 5.5, color=BLUE)

    box(ax, 12.0, 2.5, 3.5, 1.8, "Export / Share",
        "Render image\nSession report\nSnapshot comparison",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    arrow(ax, 7.7, 2.0, 11.98, 3.0, color=ORANGE)

    ax.text(8.0, 0.4,
            "Unity3D (C#) · Meta Quest 3 · OpenXR · Protein Data Bank · VR Interaction",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "molrx")


def draw_remote_meeting_system():
    fig, ax = fig_setup()
    title_bar(ax, "Meeting Room System Upgrade  —  Infrastructure",
              "Shell Script · Udev · Uptime Kuma · Linux · Display Automation")

    # Hardware
    section_label(ax, 0.4, 8.85, 4.5, "HARDWARE", ORANGE)
    for i, (dev, sub) in enumerate([
        ("Webcam",       "USB video device"),
        ("Microphone",   "USB audio input"),
        ("HDMI Monitor", "Meeting room display"),
        ("USB Hub",      "Device aggregator"),
    ]):
        box(ax, 0.5, 7.5 - i * 1.05, 3.8, 0.82, dev, sub,
            color=ORANGE, bg="#2a1400", fontsize=9)

    # Udev rules
    box(ax, 5.0, 7.5, 5.5, 1.0, "Udev Rules  (/etc/udev/rules.d/)",
        "Auto-detect USB plug/unplug · trigger service",
        color=BLUE, bg="#0a1020", fontsize=10)
    for i in range(4):
        arrow(ax, 4.32, 7.91 - i * 1.05, 4.98, 7.9, color=BLUE)

    # Systemd services
    ax.add_patch(FancyBboxPatch((4.8, 4.5), 6.0, 2.7,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=PURPLE, facecolor="#160d2a"))
    ax.text(7.8, 7.0, "Systemd Services  (auto-start)",
            ha="center", va="center", color=PURPLE, fontsize=11, fontweight="bold")
    for i, (svc, desc, c) in enumerate([
        ("display-setup.service", "Set resolution · refresh rate",  TEAL),
        ("webcam-init.service",   "v4l2 config · mjpeg stream",     GREEN),
        ("audio-route.service",   "PulseAudio device routing",      BLUE),
        ("meeting-launch.service","Start video conf. application",  ORANGE),
    ]):
        box(ax, 5.0, 6.6 - i * 0.58, 5.6, 0.45, svc, desc,
            color=c, bg=PANEL, fontsize=8)
    arrow(ax, 7.8, 7.48, 7.8, 7.22, color=PURPLE)

    # Shell scripts
    box(ax, 4.8, 3.0, 6.0, 1.2, "Shell Scripts (Bash)",
        "resolution.sh · audio_fix.sh\ndisplay_detect.sh · reboot_guard.sh",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    arrow(ax, 7.8, 4.48, 7.8, 4.22, color=GREEN)

    # Monitoring
    section_label(ax, 11.4, 8.85, 4.2, "MONITORING", RED)
    box(ax, 11.5, 7.3, 3.8, 1.0, "Uptime Kuma",
        "Black-box HTTP/TCP monitors",
        color=RED, bg="#2a0a0a", fontsize=10)
    box(ax, 11.5, 5.9, 3.8, 1.0, "Alert Channels",
        "Telegram · Email · Slack",
        color=ORANGE, bg="#2a1400", fontsize=10)
    arrow(ax, 13.4, 7.28, 13.4, 6.92, color=RED)

    box(ax, 11.5, 4.4, 3.8, 1.1, "Monitor Targets",
        "Video conf. app  ·  LAN network\nDisplay output  ·  Audio stream",
        color=GRAY, bg=PANEL, fontsize=9)
    arrow(ax, 13.4, 5.88, 13.4, 5.52, color=ORANGE)
    arrow(ax, 10.82, 6.4, 11.48, 6.4, color=GRAY)

    # Display config
    box(ax, 4.8, 1.5, 6.0, 1.2, "xrandr / EDID Configuration",
        "HDMI-1 2560×1080 @ 60Hz\nMulti-monitor layout · DPI scaling",
        color=TEAL, bg=CARD, fontsize=10)
    arrow(ax, 7.8, 2.98, 7.8, 2.72, color=TEAL)

    box(ax, 0.5, 1.5, 3.8, 1.2, "Target OS: Ubuntu 20.04",
        "LTS · headless-safe\nNetwork boot ready",
        color=GRAY, bg=PANEL, fontsize=9)

    ax.text(8.0, 0.4,
            "Shell Script · Udev · Systemd · xrandr · v4l2 · PulseAudio · Uptime Kuma · Ubuntu",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "remote-meeting-system")


# ── Registry: project_id → draw function ──────────────────────────────────────

PROJECTS = {
    "ebook":                  draw_ebook,
    "daodao":                 draw_daodao,
    "gcp-livekit-infra":      draw_gcp_livekit_infra,
    "stock-mlops":            draw_stock_mlops,
    "llm-assistance":         draw_llm_assistance,
    "de":                     draw_de,
    "monitoring-system":      draw_monitoring_system,
    "clothes":                draw_clothes,
    "aidc":                   draw_aidc,
    "amd":                    draw_amd,
    "backup-start-up":        draw_backup_start_up,
    "rm2":                    draw_rm2,
    "molrx":                  draw_molrx,
    "remote-meeting-system":  draw_remote_meeting_system,
}


def main():
    parser = argparse.ArgumentParser(
        description="Generate portfolio architecture diagrams."
    )
    parser.add_argument(
        "projects", nargs="*",
        help="Project IDs to regenerate (default: all)",
    )
    parser.add_argument(
        "--list", action="store_true",
        help="List available project IDs and exit",
    )
    args = parser.parse_args()

    if args.list:
        print("Available project IDs:")
        for pid in sorted(PROJECTS):
            print(f"  {pid}")
        return

    targets = args.projects if args.projects else list(PROJECTS.keys())
    unknown = [p for p in targets if p not in PROJECTS]
    if unknown:
        print(f"[ERROR] Unknown project(s): {', '.join(unknown)}", file=sys.stderr)
        print("Run with --list to see available IDs.", file=sys.stderr)
        sys.exit(1)

    os.makedirs(IMG_ROOT, exist_ok=True)
    print(f"Generating {len(targets)} diagram(s)...")
    for pid in targets:
        PROJECTS[pid]()
    print(f"\nDone. Output → {IMG_ROOT}")


if __name__ == "__main__":
    main()
