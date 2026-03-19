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
from matplotlib.patches import FancyBboxPatch, Polygon

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
              "Prefect · Celery · MLflow · FastAPI · Prometheus · Grafana")

    # ── Row 1: Ingestion ────────────────────────────────────────────────────
    box(ax, 0.5,  7.6, 3.5, 1.0, "Market Data API",
        "Yahoo Finance / Alpha Vantage", color=ORANGE, bg="#2a1400", fontsize=10)
    box(ax, 4.5,  7.6, 3.5, 1.0, "Kafka Topic",
        "raw_stock_data stream",         color=YELLOW, bg="#1a1500", fontsize=10)
    box(ax, 8.5,  7.6, 3.5, 1.0, "Prefect Scheduler",
        "Daily pipeline trigger",        color=TEAL,   bg=CARD,      fontsize=10)
    box(ax, 12.5, 7.6, 3.0, 1.0, "GitHub Actions",
        "CI/CD pipeline",                color=BLUE,   bg="#0a1020", fontsize=10)
    arrow(ax, 4.02, 8.1, 4.48, 8.1, color=ORANGE)
    arrow(ax, 8.02, 8.1, 8.48, 8.1, color=YELLOW)

    # ── Row 2: Prefect pipeline ─────────────────────────────────────────────
    ax.add_patch(FancyBboxPatch((0.4, 5.3), 11.0, 1.9,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=TEAL, facecolor="#0a1e20"))
    ax.text(5.9, 7.0, "Prefect  —  Pipeline Orchestration",
            ha="center", va="center", color=TEAL, fontsize=12, fontweight="bold")
    for i, (lab, sub, c) in enumerate([
        ("ETL Flow",     "Fetch · clean · store",      ORANGE),
        ("Feature Eng",  "Technical indicators · lag",  BLUE),
        ("Celery Train", "Async hyperparameter search", PURPLE),
        ("Predict Flow", "Batch predictions · cache",   GREEN),
    ]):
        box(ax, 0.6 + i * 2.75, 5.42, 2.55, 1.2, lab, sub,
            color=c, bg=PANEL, fontsize=9)
    arrow(ax, 5.9, 7.58, 5.9, 7.22, color=TEAL)

    # ── Row 3: Storage ───────────────────────────────────────────────────────
    for i, (lab, sub, c) in enumerate([
        ("PostgreSQL",  "OHLCV · features",   BLUE),
        ("ClickHouse",  "Time-series OLAP",   TEAL),
        ("MinIO / S3",  "Model artifacts",    ORANGE),
        ("MLflow",      "Experiment tracking",PURPLE),
    ]):
        box(ax, 0.5 + i * 2.75, 3.8, 2.5, 1.1, lab, sub,
            color=c, bg=PANEL, fontsize=9)
    arrow(ax, 5.9, 5.28, 5.9, 4.93, color=TEAL)

    # ── Row 4: Serving ───────────────────────────────────────────────────────
    box(ax, 0.5, 2.1, 5.0, 1.4, "FastAPI  —  Prediction Service",
        "POST /predict  ·  GET /history  ·  GET /models",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    box(ax, 6.2, 2.1, 5.0, 1.4, "Prometheus + Grafana",
        "Metrics scraping · drift detection · KPI dashboards",
        color=ORANGE, bg="#2a1000", fontsize=10)
    box(ax, 12.2, 2.1, 3.3, 1.4, "React Frontend",
        "Prediction chart\nHistory · metrics",
        color=TEAL, bg=CARD, fontsize=10)
    arrow(ax, 5.9, 3.78, 3.0, 3.52, color=GREEN)
    arrow(ax, 5.9, 3.78, 8.7, 3.52, color=ORANGE)
    arrow_lr(ax, 11.22, 2.8, 12.18, 2.8, color=TEAL)

    ax.text(8.0, 0.9,
            "Docker Compose · Prefect · Celery · MLflow · FastAPI · PostgreSQL · ClickHouse",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "stock-mlops")


def draw_llm_assistance():
    fig, ax = fig_setup()
    title_bar(ax, "AI Research Curator  —  RAG System Architecture",
              "Prefect · Qdrant · LangChain · Ollama · FastAPI · React")

    # ── Row 1: Ingestion Pipeline ────────────────────────────────────────────
    box(ax, 0.5,  7.6, 3.5, 1.0, "arXiv API",
        "Daily paper feed",             color=ORANGE, bg="#2a1400", fontsize=10)
    box(ax, 4.5,  7.6, 3.5, 1.0, "Prefect DAG",
        "Schedule · retry · monitor",   color=TEAL,   bg=CARD,      fontsize=10)
    box(ax, 8.5,  7.6, 3.5, 1.0, "PDF → Chunk → Embed",
        "MinIO · LangChain · Ollama",   color=PURPLE, bg="#160d2a", fontsize=10)
    box(ax, 12.5, 7.6, 3.0, 1.0, "Qdrant Index",
        "Vector upsert",                color=PURPLE, bg="#160d2a", fontsize=10)
    arrow(ax, 4.02, 8.1, 4.48, 8.1, color=ORANGE)
    arrow(ax, 8.02, 8.1, 8.48, 8.1, color=TEAL)
    arrow(ax, 12.02, 8.1, 12.48, 8.1, color=PURPLE)

    # ── Center: FastAPI Backend ──────────────────────────────────────────────
    ax.add_patch(FancyBboxPatch((2.0, 3.8), 10.5, 3.1,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=GREEN, facecolor="#0a1a0a"))
    ax.text(7.25, 6.7, "FastAPI Backend",
            ha="center", va="center", color=GREEN, fontsize=12, fontweight="bold")
    for i, (ep, sub, c) in enumerate([
        ("POST /search",    "Semantic / keyword query", TEAL),
        ("POST /rag/ask",   "RAG Q&A with Ollama LLM",  PURPLE),
        ("GET  /papers",    "List · filter · paginate",  BLUE),
        ("GET  /stats",     "Analytics · topic trends",  GREEN),
    ]):
        box(ax, 2.2 + i * 2.6, 3.92, 2.4, 1.2, ep, sub,
            color=c, bg=PANEL, fontsize=9)
    arrow(ax, 7.25, 7.58, 7.25, 6.92, color=GREEN)

    # ── Row 3: Storage ───────────────────────────────────────────────────────
    for i, (lab, sub, c) in enumerate([
        ("Qdrant",      "Vector search",      PURPLE),
        ("MinIO",       "PDF storage",        ORANGE),
        ("PostgreSQL",  "Metadata · history", BLUE),
        ("Ollama LLM",  "llama3 · nomic-embed",TEAL),
    ]):
        box(ax, 0.5 + i * 2.85, 2.0, 2.6, 1.1, lab, sub,
            color=c, bg=PANEL, fontsize=9)
    arrow(ax, 7.25, 3.78, 7.25, 3.13, color=GREEN)

    # ── Right: React Dashboard ───────────────────────────────────────────────
    box(ax, 12.5, 5.8, 3.0, 1.0, "React Dashboard",
        "Search · RAG Chat\nPaper detail · Stats",
        color=TEAL, bg=CARD, fontsize=9)
    arrow_lr(ax, 12.52, 5.0, 12.52, 5.78, color=TEAL)

    ax.text(7.25, 0.9,
            "Docker Compose · Prefect · Qdrant · MinIO · PostgreSQL · Ollama · LangChain",
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
              "YOLO · PyTorch · Flask · MySQL · Redis · Docker Compose")

    # ── Left: Capture ────────────────────────────────────────────────────────
    box(ax, 0.4, 7.5, 3.5, 1.1, "Industrial Camera",
        "Production line · frame grab",
        color=ORANGE, bg="#2a1400", fontsize=10)
    box(ax, 0.4, 5.9, 3.5, 1.1, "Image Preprocessor",
        "Resize · Normalize · Augment",
        color=ORANGE, bg="#2a1000", fontsize=10)
    arrow(ax, 2.15, 7.48, 2.15, 7.02, color=ORANGE)
    arrow(ax, 2.15, 5.88, 2.15, 5.12, color=ORANGE)

    # ── Center: AI Inference ─────────────────────────────────────────────────
    ax.add_patch(FancyBboxPatch((4.5, 5.0), 7.0, 3.7,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=RED, facecolor="#200808"))
    ax.text(8.0, 8.5, "AI Inference Engine",
            ha="center", va="center", color=RED, fontsize=12, fontweight="bold")
    box(ax, 4.7, 6.8, 3.0, 1.1, "YOLO Detection",
        "Localize defects · bounding box", color=RED, bg="#2a0a0a", fontsize=10)
    box(ax, 8.3, 6.8, 3.0, 1.1, "CNN Classifier",
        "Defect type · confidence score",  color=PURPLE, bg="#160d2a", fontsize=10)
    box(ax, 5.5, 5.2, 5.0, 1.1, "Result Aggregator",
        "Ensemble · bounding box · defect class",
        color=YELLOW, bg="#1a1500", fontsize=10)
    arrow(ax, 3.92, 6.4, 4.68, 7.1,  color=ORANGE)
    arrow(ax, 7.82, 7.35, 8.28, 7.35, "combine", RED)
    arrow(ax, 6.2,  6.78, 6.2,  6.32, color=RED)
    arrow(ax, 9.8,  6.78, 9.3,  6.32, color=PURPLE)

    # ── Model Training Pipeline ──────────────────────────────────────────────
    ax.add_patch(FancyBboxPatch((4.5, 2.9), 7.0, 1.8,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=1.5, edgecolor=TEAL, facecolor="#0a1e20"))
    ax.text(8.0, 4.52, "Model Training Pipeline",
            ha="center", va="center", color=TEAL, fontsize=11, fontweight="bold")
    for i, (lab, sub, c) in enumerate([
        ("Dataset Prep", "Annotate · split", ORANGE),
        ("Train / Val",  "Epoch · mAP",      TEAL),
        ("Export",       ".pt → TensorRT",   GREEN),
    ]):
        box(ax, 4.7 + i * 2.3, 3.02, 2.1, 1.2, lab, sub,
            color=c, bg=PANEL, fontsize=9)
    arrow(ax, 8.0, 5.18, 8.0, 4.72, color=YELLOW)

    # ── Bottom: Backend + Storage ────────────────────────────────────────────
    box(ax, 0.4, 3.4, 3.5, 1.1, "Flask REST API",
        "POST /detect · GET /results",
        color=BLUE, bg="#0a1020", fontsize=10)
    box(ax, 0.4, 1.8, 1.5, 1.1, "MySQL",
        "Results\n· history", color=TEAL, bg=CARD, fontsize=9)
    box(ax, 2.2, 1.8, 1.5, 1.1, "Redis",
        "Hot cache\n· queue", color=RED, bg="#2a0a0a", fontsize=9)
    arrow(ax, 2.15, 5.38, 2.15, 4.52, color=BLUE)
    arrow(ax, 1.15, 3.38, 1.15, 2.92, color=TEAL)
    arrow(ax, 3.15, 3.38, 2.95, 2.92, color=RED)

    # ── Right: Dashboard ─────────────────────────────────────────────────────
    box(ax, 12.2, 7.3, 3.3, 1.1, "Inspection Dashboard",
        "Real-time defect viewer", color=GREEN, bg="#0a1a0a", fontsize=10)
    box(ax, 12.2, 5.7, 3.3, 1.1, "Training Monitor",
        "Loss curve · accuracy",   color=YELLOW, bg="#1a1500", fontsize=10)
    box(ax, 12.2, 4.1, 3.3, 1.1, "Alert System",
        "Threshold · notify",      color=RED, bg="#2a0a0a", fontsize=10)
    arrow(ax, 11.52, 5.7, 12.18, 7.6, color=GREEN)
    arrow(ax, 11.52, 4.5, 12.18, 6.0, color=YELLOW)
    arrow(ax, 3.92, 3.95, 12.18, 4.5, color=RED)

    ax.text(8.0, 0.9,
            "Docker Compose · Flask · MySQL · Redis · PyTorch · YOLO · Nginx",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "aidc")


def draw_amd():
    fig, ax = fig_setup()
    title_bar(ax, "AMD Rehabilitation Platform  —  System Architecture",
              "Unity3D · C# · TensorRT · NVIDIA CUDA · Ansible · SQLite")

    # ── Left column: Patient Flow ────────────────────────────────────────────
    section_label(ax, 0.4, 8.85, 4.5, "PATIENT TRAINING FLOW", TEAL)
    box(ax, 0.5, 7.3, 4.0, 1.1, "Patient Login",
        "SQLite credentials · profile load",
        color=TEAL, bg=CARD, fontsize=10)
    box(ax, 0.5, 5.7, 4.0, 1.1, "Training Session (Unity UI)",
        "Visual stimulus · eccentric position",
        color=TEAL2, bg=CARD, fontsize=10)
    box(ax, 0.5, 4.1, 4.0, 1.1, "Pupil Tracking Engine",
        "TensorRT inference · eye-position vector",
        color=PURPLE, bg="#160d2a", fontsize=10)
    box(ax, 0.5, 2.5, 4.0, 1.1, "Session Results",
        "Accuracy · Response Time · Heatmap",
        color=ORANGE, bg="#2a1400", fontsize=10)
    box(ax, 0.5, 0.9, 4.0, 1.1, "SQLite Database",
        "FundusImage · Logs · Training Records",
        color=YELLOW, bg="#1a1500", fontsize=10)
    arrow(ax, 2.5, 7.28, 2.5, 6.82, color=TEAL)
    arrow(ax, 2.5, 5.68, 2.5, 5.22, color=TEAL2)
    arrow(ax, 2.5, 4.08, 2.5, 3.62, color=PURPLE)
    arrow(ax, 2.5, 2.48, 2.5, 2.02, color=ORANGE)

    # ── Center column: GPU Stack ─────────────────────────────────────────────
    section_label(ax, 5.5, 8.85, 4.5, "NVIDIA GPU STACK", ORANGE)
    for i, (label, sub, c, bg_c) in enumerate([
        ("NVIDIA Driver + CUDA", "Driver 535 · CUDA Toolkit",    ORANGE, "#2a1400"),
        ("cuDNN + TensorRT",     "Optimised inference engine",   RED,    "#2a0a0a"),
        ("OpenCV (Camera)",      "Video capture · frame process",GREEN,  "#0a1a0a"),
        ("Virtual Webcam",       "v4l2loopback · mjpeg stream",  BLUE,   "#0a1020"),
    ]):
        box(ax, 5.6, 7.2 - i * 1.55, 4.2, 1.2, label, sub,
            color=c, bg=bg_c, fontsize=10)
        if i < 3:
            arrow(ax, 7.7, 7.18 - i * 1.55, 7.7, 6.52 - i * 1.55, color=c)
    arrow(ax, 5.58, 4.8, 4.52, 4.65, "infer", RED)

    # ── Right column: Ansible Deployment ────────────────────────────────────
    section_label(ax, 10.4, 8.85, 5.2, "ANSIBLE DEPLOYMENT", GREEN)
    box(ax, 10.5, 7.3, 4.8, 1.1, "Ansible Control Node",
        "Playbooks · Inventory · common_vars.yml",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    box(ax, 10.5, 5.7, 4.8, 1.1, "Build & Package",
        "Compile Unity app · export TensorRT model",
        color=TEAL, bg=CARD, fontsize=10)
    box(ax, 10.5, 4.1, 4.8, 1.1, "Deploy to Machines",
        "rsync build · restore SQLite DB",
        color=BLUE, bg="#0a1020", fontsize=10)
    box(ax, 10.5, 2.5, 2.2, 1.1, "Dev Machine",  "192.168.x.165", color=TEAL,  bg=CARD, fontsize=9)
    box(ax, 13.1, 2.5, 2.2, 1.1, "Prod Machine", "192.168.x.29",  color=GREEN, bg=CARD, fontsize=9)
    arrow(ax, 12.9, 7.28, 12.9, 6.82, color=GREEN)
    arrow(ax, 12.9, 5.68, 12.9, 5.22, color=TEAL)
    arrow(ax, 11.6, 4.08, 11.6, 3.62, color=BLUE)
    arrow(ax, 14.2, 4.08, 14.2, 3.62, color=GREEN)

    ax.text(8.0, 0.35,
            "Unity3D (C#) · SQLite · Ansible · NVIDIA CUDA · TensorRT · OpenCV",
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
    title_bar(ax, "Meeting Room System  —  Infrastructure",
              "Shell Script · Udev · Systemd · Uptime Kuma · Ubuntu")

    # ── Left: Hardware ───────────────────────────────────────────────────────
    section_label(ax, 0.4, 8.85, 3.8, "HARDWARE", ORANGE)
    for i, (dev, sub) in enumerate([
        ("Webcam",        "USB video device"),
        ("Microphone",    "USB audio input"),
        ("HDMI Monitor",  "Meeting room display"),
        ("USB Hub",       "Device aggregator"),
    ]):
        box(ax, 0.5, 7.3 - i * 1.45, 3.5, 1.1, dev, sub,
            color=ORANGE, bg="#2a1400", fontsize=10)

    # ── Center: Automation Pipeline ──────────────────────────────────────────
    box(ax, 5.0, 7.3, 6.5, 1.1, "Udev Rules  (/etc/udev/rules.d/)",
        "Auto-detect USB plug/unplug · trigger systemd service",
        color=BLUE, bg="#0a1020", fontsize=10)
    for i in range(4):
        arrow(ax, 4.02, 7.85 - i * 1.45, 4.98, 7.85, color=BLUE)

    ax.add_patch(FancyBboxPatch((4.8, 4.2), 6.9, 2.7,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=PURPLE, facecolor="#160d2a"))
    ax.text(8.25, 6.72, "Systemd Services  (auto-start)",
            ha="center", va="center", color=PURPLE, fontsize=11, fontweight="bold")
    for i, (svc, c) in enumerate([
        ("display-setup  ·  webcam-init", TEAL),
        ("audio-route  ·  meeting-launch", ORANGE),
    ]):
        box(ax, 5.0, 5.95 - i * 0.88, 6.5, 0.65, svc,
            color=c, bg=PANEL, fontsize=9)
    arrow(ax, 8.25, 7.28, 8.25, 6.92, color=PURPLE)

    box(ax, 5.0, 2.7, 6.5, 1.2, "Shell Scripts  (Bash)",
        "resolution.sh · audio_fix.sh · display_detect.sh",
        color=GREEN, bg="#0a1a0a", fontsize=10)
    arrow(ax, 8.25, 4.18, 8.25, 3.92, color=GREEN)

    box(ax, 5.0, 0.9, 6.5, 1.3, "Target OS: Ubuntu 20.04 LTS",
        "xrandr · v4l2loopback · PulseAudio · headless-safe",
        color=GRAY, bg=PANEL, fontsize=10)
    arrow(ax, 8.25, 2.68, 8.25, 2.22, color=TEAL)

    # ── Right: Monitoring ────────────────────────────────────────────────────
    section_label(ax, 12.2, 8.85, 3.5, "MONITORING", RED)
    box(ax, 12.3, 7.3, 3.3, 1.1, "Uptime Kuma",
        "HTTP/TCP black-box monitor",
        color=RED, bg="#2a0a0a", fontsize=10)
    box(ax, 12.3, 5.7, 3.3, 1.1, "Alert Channels",
        "Telegram · Email · Slack",
        color=ORANGE, bg="#2a1400", fontsize=10)
    box(ax, 12.3, 4.1, 3.3, 1.1, "Monitor Targets",
        "Video app · LAN · Display · Audio",
        color=GRAY, bg=PANEL, fontsize=10)
    arrow(ax, 13.95, 7.28, 13.95, 6.82, color=RED)
    arrow(ax, 13.95, 5.68, 13.95, 5.22, color=ORANGE)
    arrow(ax, 11.72, 5.5, 12.28, 5.5, color=GRAY)

    ax.text(8.0, 0.35,
            "Shell Script · Udev · Systemd · xrandr · v4l2 · PulseAudio · Uptime Kuma · Ubuntu",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    _save(fig, "remote-meeting-system")


# ══════════════════════════════════════════════════════════════════════════════
# FLOW DIAGRAM HELPERS
# ══════════════════════════════════════════════════════════════════════════════

# Standard y-center grids (box height FH = 0.75)
FH = 0.75   # flow box height
FW = 8.0    # flow box width (centered at x=8 → x∈[4, 12])

Y6 = [8.30, 7.15, 6.00, 4.85, 3.70, 2.55, 1.40]   # 6 main steps + end
Y7 = [8.30, 7.20, 6.10, 5.00, 3.90, 2.80, 1.70]   # 7 main steps


def fbox(ax, cx, cy, w, h, label, sub=None, color=TEAL, bg=PANEL, fontsize=10):
    """Box centered at (cx, cy) — flow diagram variant."""
    box(ax, cx - w / 2, cy - h / 2, w, h, label, sub, color, bg, fontsize)


def fdiamond(ax, cx, cy, w, h, label, color=YELLOW, bg="#1a1500", fontsize=9):
    """Decision diamond centered at (cx, cy)."""
    dx, dy = w / 2, h / 2
    pts = [(cx, cy + dy), (cx + dx, cy), (cx, cy - dy), (cx - dx, cy)]
    ax.add_patch(Polygon(pts, closed=True, linewidth=1.5,
                         edgecolor=color, facecolor=bg))
    ax.text(cx, cy, label, ha="center", va="center",
            color=WHITE, fontsize=fontsize, fontweight="bold")


def fconnect(ax, cy1, cy2, cx=8.0, nh=FH, color=GRAY, label=None):
    """Arrow from bottom of node cy1 to top of node cy2."""
    arrow(ax, cx, cy1 - nh / 2, cx, cy2 + nh / 2, label, color)


def fconnect_d(ax, cy_d, cy2, cx=8.0, dh=1.0, nh=FH, label="YES", color=GREEN):
    """Arrow from diamond bottom to next box top."""
    arrow(ax, cx, cy_d - dh / 2, cx, cy2 + nh / 2, label, color)


def phase_bar(ax, y_top, y_bot, label, color):
    """Vertical colored phase label on the left edge."""
    h = max(y_top - y_bot, 0.3)
    ax.add_patch(FancyBboxPatch(
        (0.25, y_bot - 0.08), 0.5, h + 0.16,
        boxstyle="round,pad=0.0,rounding_size=0.12",
        linewidth=0, facecolor=color, alpha=0.75,
    ))
    if h > 0.55:
        ax.text(0.5, (y_top + y_bot) / 2, label,
                ha="center", va="center", color=WHITE,
                fontsize=7.5, fontweight="bold", rotation=90)


def sidebar(ax, cy, label, sub, color):
    """Small info box to the right of the main flow."""
    fbox(ax, 13.8, cy, 3.2, FH, label, sub, color=color, bg=PANEL, fontsize=9)
    arrow(ax, 12.0, cy, 12.2, cy, color=color)


# ══════════════════════════════════════════════════════════════════════════════
# FLOW DIAGRAMS  (flow.png per project)
# ══════════════════════════════════════════════════════════════════════════════

def draw_ebook_flow():
    fig, ax = fig_setup()
    title_bar(ax, "Ebook Reader  —  User Journey",
              "Open · Login · Browse · Read · Sync")
    phase_bar(ax, Y6[0] + FH/2, Y6[1] - FH/2, "AUTH",    GREEN)
    phase_bar(ax, Y6[1] + FH/2, Y6[3] - FH/2, "LIBRARY", BLUE)
    phase_bar(ax, Y6[3] + FH/2, Y6[6] - FH/2, "READ",    PURPLE)
    steps = [
        (Y6[0], "Open App",                  "github.io/ebook-reader",          TEAL),
        (Y6[1], "GitHub OAuth Login",         "Supabase Auth · JWT session",     GREEN),
        (Y6[2], "View Book Library",          "Dashboard · stats · filters",     BLUE),
        (Y6[3], "Browse & Select Book",       "Grid view · search · tags",       BLUE),
        (Y6[4], "Open PDF in Reader",         "React PDF Viewer · dark mode",    PURPLE),
        (Y6[5], "Reading Session",            "Page nav · progress tracking",    PURPLE),
        (Y6[6], "Sync Progress to Supabase",  "IndexedDB ↔ Cloud · auto-save",   TEAL),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    ax.text(8.0, 0.55, "React 19 · Supabase · GitHub OAuth · React PDF Viewer · IndexedDB",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "ebook", "flow.png")


def draw_daodao_flow():
    fig, ax = fig_setup()
    title_bar(ax, "DaoDAO Education Platform  —  Data Pipeline Flow",
              "MongoDB · Notion API → Airflow → PostgreSQL → Frontend")
    phase_bar(ax, Y7[0] + FH/2, Y7[0] - FH/2, "TRIGGER",   ORANGE)
    phase_bar(ax, Y7[1] + FH/2, Y7[2] - FH/2, "EXTRACT",   TEAL)
    phase_bar(ax, Y7[3] + FH/2, Y7[4] - FH/2, "TRANSFORM", BLUE)
    phase_bar(ax, Y7[5] + FH/2, Y7[6] - FH/2, "LOAD",      GREEN)
    steps = [
        (Y7[0], "Airflow Scheduled DAG",      "Daily / Monthly · CRON",          ORANGE),
        (Y7[1], "Extract from MongoDB",       "users · activities · marathons",  TEAL),
        (Y7[2], "Extract from Notion API",    "store · resources",               TEAL2),
        (Y7[3], "Transform & Normalize",      "Python · Pandas · SQLAlchemy",    BLUE),
        (Y7[4], "Load to Staging Tables",     "old_user · old_activities …",     BLUE),
        (Y7[5], "Migration Tasks",            "Referential integrity · schemas", GRAY),
        (Y7[6], "Normalized PostgreSQL",      "Final production database",       GREEN),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    sidebar(ax, Y7[5], "Next.js Web",   "daoedu.tw",  TEAL)
    sidebar(ax, Y7[6], "React Native",  "Mobile App", TEAL2)
    ax.text(8.0, 0.55, "Airflow · Python · MongoDB · Notion API · PostgreSQL · Docker · Ansible",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "daodao", "flow.png")


def draw_gcp_livekit_infra_flow():
    fig, ax = fig_setup()
    title_bar(ax, "Low Vision Glasses  —  User Session Flow",
              "Firebase Auth · JWT · LiveKit WebRTC · AI Agent")
    phase_bar(ax, Y6[0] + FH/2, Y6[2] - FH/2, "AUTH",    ORANGE)
    phase_bar(ax, Y6[2] + FH/2, Y6[4] - FH/2, "SESSION", TEAL)
    phase_bar(ax, Y6[4] + FH/2, Y6[6] - FH/2, "CLOSE",   GRAY)
    steps = [
        (Y6[0], "Open Glasses App",            "Client device startup",              TEAL),
        (Y6[1], "Firebase Authentication",     "OAuth · JWT issued",                 ORANGE),
        (Y6[2], "Get WebRTC Token",            "Token Service FastAPI · signed JWT",  BLUE),
        (Y6[3], "Connect to LiveKit Server",   "UDP / SRTP media stream",            TEAL),
        (Y6[4], "Real-time AI Agent Session",  "LLM processing · audio response",    PURPLE),
        (Y6[5], "End Session",                 "Disconnect · cleanup resources",     GRAY),
        (Y6[6], "Session Archived",            "Log · billing record",               GRAY),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    sidebar(ax, Y6[2], "GCP VPC",      "Firewall · IAM",  BLUE)
    sidebar(ax, Y6[3], "Ansible IaC",  "Auto deploy",     GREEN)
    ax.text(8.0, 0.55, "GCP · Firebase Auth · LiveKit · FastAPI · WebRTC · Ansible · Python",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "gcp-livekit-infra", "flow.png")


def draw_stock_mlops_flow():
    fig, ax = fig_setup()
    title_bar(ax, "Stock MLOps  —  Pipeline Flow",
              "Prefect · Celery · MLflow · FastAPI · Prometheus")
    phase_bar(ax, Y7[0] + FH/2, Y7[1] - FH/2, "INGEST",  TEAL)
    phase_bar(ax, Y7[2] + FH/2, Y7[3] - FH/2, "TRAIN",   ORANGE)
    phase_bar(ax, Y7[4] + FH/2, Y7[5] - FH/2, "DEPLOY",  BLUE)
    phase_bar(ax, Y7[6] + FH/2, Y7[6] - FH/2, "MONITOR", GREEN)
    steps = [
        (Y7[0], "Daily Prefect Scheduler",    "Market data trigger",                 TEAL),
        (Y7[1], "Fetch Market Data",          "Yahoo Finance API · raw OHLCV",       TEAL),
        (Y7[2], "ETL & Feature Engineering",  "ClickHouse · Kafka · feature store",  ORANGE),
        (Y7[3], "Celery: Model Training",     "Async task · hyperparameter search",  ORANGE),
        (Y7[4], "MLflow: Register Model",     "Experiment tracking · versioning",    BLUE),
        (Y7[5], "FastAPI: Serve Predictions", "REST endpoints · batch + realtime",   BLUE),
        (Y7[6], "Prometheus + Grafana",       "Drift detection · KPI dashboards",    GREEN),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    sidebar(ax, Y7[3], "GitHub Actions", "CI/CD pipeline",  GRAY)
    sidebar(ax, Y7[4], "MinIO / S3",     "Model artifacts", GRAY)
    ax.text(8.0, 0.55, "Python · Prefect · Celery · MLflow · FastAPI · PostgreSQL · ClickHouse · Kafka · Docker",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "stock-mlops", "flow.png")


def draw_llm_assistance_flow():
    fig, ax = fig_setup()
    title_bar(ax, "AI Research Curator  —  User Query Flow",
              "Prefect · Qdrant · LangChain · Ollama · FastAPI")
    phase_bar(ax, Y6[0] + FH/2, Y6[1] - FH/2, "INGEST", ORANGE)
    phase_bar(ax, Y6[1] + FH/2, Y6[3] - FH/2, "SEARCH", BLUE)
    phase_bar(ax, Y6[3] + FH/2, Y6[6] - FH/2, "ANSWER", PURPLE)
    steps = [
        (Y6[0], "Daily arXiv Paper Ingest",   "Prefect DAG · PDF download · parse",   ORANGE),
        (Y6[1], "Embed & Index in Qdrant",    "LangChain embeddings · vector store",  BLUE),
        (Y6[2], "User Submits Query",         "React Dashboard · keyword / semantic", TEAL),
        (Y6[3], "Vector Similarity Search",   "Qdrant top-K retrieval",               BLUE),
        (Y6[4], "RAG Chain",                  "Context assembly · Ollama LLM call",   PURPLE),
        (Y6[5], "Return Answer + Citations",  "Sources · confidence · history saved", PURPLE),
        (Y6[6], "Email Subscription",         "Scheduled digest · topic alerts",      TEAL),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    ax.text(8.0, 0.55, "FastAPI · Prefect · Qdrant · LangChain · Ollama · MinIO · PostgreSQL · React",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "llm-assistance", "flow.png")


def draw_de_flow():
    fig, ax = fig_setup()
    title_bar(ax, "GitHub Analytics Pipeline  —  Data Flow",
              "Airflow · GitHub API · PySpark · dbt · BigQuery · Streamlit")
    phase_bar(ax, Y6[0] + FH/2, Y6[1] - FH/2, "TRIGGER", ORANGE)
    phase_bar(ax, Y6[1] + FH/2, Y6[3] - FH/2, "PROCESS", BLUE)
    phase_bar(ax, Y6[3] + FH/2, Y6[6] - FH/2, "SERVE",   GREEN)
    steps = [
        (Y6[0], "Airflow Weekly DAG Trigger",  "Scheduled pipeline start",              ORANGE),
        (Y6[1], "GitHub API Data Fetch",       "Repos · stars · contributors · PRs",    TEAL),
        (Y6[2], "PySpark Transform",           "GCS raw → Dataproc · cleaning",         BLUE),
        (Y6[3], "dbt Models & Tests",          "Staging → Mart · data quality checks",  BLUE),
        (Y6[4], "Load to BigQuery",            "Partitioned tables · mart layer",        GREEN),
        (Y6[5], "Streamlit Dashboard",         "Trend analysis · interactive charts",    GREEN),
        (Y6[6], "Analyst Views Results",       "Filter · export · share",               TEAL),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    sidebar(ax, Y6[0], "Terraform IaC",   "GCP infra provision",   GRAY)
    sidebar(ax, Y6[4], "Docker Compose",  "Local dev environment", GRAY)
    ax.text(8.0, 0.55, "Terraform · GCP · Airflow · GitHub API · PySpark · dbt · BigQuery · Streamlit · Docker",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "de", "flow.png")


def draw_monitoring_system_flow():
    fig, ax = fig_setup()
    title_bar(ax, "Monitoring System  —  Alert Flow",
              "Prometheus · Grafana · AlertManager · Docker Compose")
    phase_bar(ax, Y6[0] + FH/2, Y6[1] - FH/2, "COLLECT",  TEAL)
    phase_bar(ax, Y6[1] + FH/2, Y6[3] - FH/2, "EVALUATE", ORANGE)
    phase_bar(ax, Y6[3] + FH/2, Y6[6] - FH/2, "ALERT",    RED)
    steps = [
        (Y6[0], "Services Expose /metrics",    "FastAPI · Node Exporter · cAdvisor",  TEAL),
        (Y6[1], "Prometheus Scrapes Targets",  "15 s interval · TSDB storage",        TEAL2),
        (Y6[2], "PromQL Rules Evaluated",      "CPU · Memory · Latency thresholds",   ORANGE),
        (Y6[3], "Alert Fires",                 "Threshold exceeded · duration met",   RED),
        (Y6[4], "AlertManager Routes",         "Deduplicate · group · silence",       RED),
        (Y6[5], "Team Notified",               "Slack · Email · PagerDuty",           GREEN),
        (Y6[6], "Post-incident Review",        "Tune rules · add dashboards",         GRAY),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    sidebar(ax, Y6[1], "Grafana Dashboards", "Live metrics view",      ORANGE)
    sidebar(ax, Y6[2], "Alert Rules YAML",   "rules.yml · thresholds", RED)
    ax.text(8.0, 0.55, "Prometheus · Grafana · AlertManager · Docker Compose · Node Exporter · cAdvisor",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "monitoring-system", "flow.png")


def draw_clothes_flow():
    fig, ax = fig_setup()
    title_bar(ax, "Color Outfit Recommendation  —  User Flow",
              "FastAPI · Color Theory · Style Classifier · MySQL · Redis")
    phase_bar(ax, Y6[0] + FH/2, Y6[1] - FH/2, "INPUT",   TEAL)
    phase_bar(ax, Y6[1] + FH/2, Y6[3] - FH/2, "PROCESS", ORANGE)
    phase_bar(ax, Y6[3] + FH/2, Y6[6] - FH/2, "OUTPUT",  GREEN)
    steps = [
        (Y6[0], "User Opens App",              "React frontend · style selector",     TEAL),
        (Y6[1], "Select Style & Input Color",  "Style type · color seed input",       BLUE),
        (Y6[2], "Color Wheel Analysis",        "HSL · complementary · analogous",     ORANGE),
        (Y6[3], "Style Classifier",            "Minimalist / Industrial / Vintage …", ORANGE),
        (Y6[4], "Outfit Matcher & Ranker",     "Top × Bottom × Accessory sets",       GREEN),
        (Y6[5], "Show Recommendations",        "Outfit cards · save favourites",      GREEN),
        (Y6[6], "Personalised Profile",        "Saved looks · history",               TEAL),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    sidebar(ax, Y6[2], "Web Scraper",   "Pinterest · Instagram", PURPLE)
    sidebar(ax, Y6[3], "MySQL + Redis", "Outfits · cache",       TEAL)
    ax.text(8.0, 0.55, "Python · FastAPI · MySQL · Redis · React · Docker · Scikit-learn · Pandas",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "clothes", "flow.png")


def draw_aidc_flow():
    fig, ax = fig_setup()
    title_bar(ax, "AI Defect Detection  —  Inspection Flow",
              "Camera → YOLO → CNN → Alert → MySQL")
    ys = [8.30, 7.15, 6.00, 4.75, 3.55, 2.40, 1.35]
    phase_bar(ax, ys[0] + FH/2, ys[1] - FH/2, "CAPTURE", ORANGE)
    phase_bar(ax, ys[1] + FH/2, ys[3] - FH/2, "DETECT",  RED)
    phase_bar(ax, ys[3] + FH/2, ys[5] - FH/2, "ACTION",  GREEN)
    fbox(ax, 8.0, ys[0], FW, FH, "Industrial Camera Capture",  "Production line · frame grab",       ORANGE)
    fconnect(ax, ys[0], ys[1], color=ORANGE)
    fbox(ax, 8.0, ys[1], FW, FH, "Image Preprocessing",        "Resize · normalize · augment",       ORANGE)
    fconnect(ax, ys[1], ys[2], color=ORANGE)
    fbox(ax, 8.0, ys[2], FW, FH, "YOLO Object Detection",      "Localise defect · bounding box",     RED)
    # box → diamond (use diamond half-height = 0.5)
    arrow(ax, 8.0, ys[2] - FH/2, 8.0, ys[3] + 0.5, None, RED)
    fdiamond(ax, 8.0, ys[3], 5.5, 1.0, "Defect Confidence > Threshold?", YELLOW)
    fconnect_d(ax, ys[3], ys[4], label="YES", color=RED)
    fbox(ax, 13.8, ys[3], 3.2, FH, "Pass ✓",  "Continue production", GREEN)
    arrow(ax, 8.0 + 2.75, ys[3], 12.2, ys[3], "NO", GREEN)
    fbox(ax, 8.0, ys[4], FW, FH, "Alert Operator",       "Trigger alarm · highlight region", RED)
    fconnect(ax, ys[4], ys[5], color=RED)
    fbox(ax, 8.0, ys[5], FW, FH, "Log Defect to MySQL",  "Type · image path · timestamp",    TEAL)
    fconnect(ax, ys[5], ys[6], color=TEAL)
    fbox(ax, 8.0, ys[6], 6.0, FH, "Generate Inspection Report",
         "Daily summary · defect rate stats", GRAY)
    ax.text(8.0, 0.55, "Python · Flask · YOLO · PyTorch · MySQL · Redis · Docker",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "aidc", "flow.png")


def draw_amd_flow():
    fig, ax = fig_setup()
    title_bar(ax, "AMD Rehabilitation Platform  —  Patient Training Flow",
              "Unity3D · C# · Pupil Tracking · SQLite")
    phase_bar(ax, Y6[0] + FH/2, Y6[1] - FH/2, "INIT",   TEAL)
    phase_bar(ax, Y6[1] + FH/2, Y6[3] - FH/2, "TRAIN",  PURPLE)
    phase_bar(ax, Y6[3] + FH/2, Y6[6] - FH/2, "REPORT", GREEN)
    steps = [
        (Y6[0], "Patient Login",              "SQLite credentials · profile load",    TEAL),
        (Y6[1], "Select Training Mode",       "Eccentric position · difficulty",      TEAL2),
        (Y6[2], "Training Session Begins",    "Unity UI · visual stimulus display",   PURPLE),
        (Y6[3], "Pupil Tracking Active",      "TensorRT · webcam · position vector",  PURPLE),
        (Y6[4], "Session Results Calculated", "Accuracy · response time · heatmap",   ORANGE),
        (Y6[5], "Data Saved to SQLite",       "FundusImage · Logs · records",         YELLOW),
        (Y6[6], "View Progress Report",       "Historical charts · doctor review",    GREEN),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    sidebar(ax, Y6[2], "Ansible Deploy", "Multi-machine rollout", GREEN)
    ax.text(8.0, 0.55, "Unity3D · C# · TensorRT · OpenCV · SQLite · Ansible · NVIDIA CUDA",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "amd", "flow.png")


def draw_backup_start_up_flow():
    fig, ax = fig_setup()
    title_bar(ax, "Monthly Stand-Up Backup  —  Automation Flow",
              "Airflow · Python · PostgreSQL · Docker")
    ys = [8.30, 7.15, 6.00, 4.75, 3.55, 2.40, 1.35]
    phase_bar(ax, ys[0] + FH/2, ys[0] - FH/2, "TRIGGER",  ORANGE)
    phase_bar(ax, ys[1] + FH/2, ys[2] - FH/2, "COLLECT",  TEAL)
    phase_bar(ax, ys[2] + FH/2, ys[3] - FH/2, "VALIDATE", YELLOW)
    phase_bar(ax, ys[4] + FH/2, ys[5] - FH/2, "STORE",    BLUE)
    phase_bar(ax, ys[5] + FH/2, ys[6] - FH/2, "REPORT",   GREEN)
    fbox(ax, 8.0, ys[0], FW, FH, "Monthly Cron Trigger",
         "Airflow DAG · 1st of month", ORANGE)
    fconnect(ax, ys[0], ys[1], color=ORANGE)
    fbox(ax, 8.0, ys[1], FW, FH, "Collect Stand-Up Records",
         "Python script · source system", TEAL)
    fconnect(ax, ys[1], ys[2], color=TEAL)
    fbox(ax, 8.0, ys[2], FW, FH, "Parse & Normalize",
         "Timestamp · author · content", TEAL2)
    arrow(ax, 8.0, ys[2] - FH/2, 8.0, ys[3] + 0.5, None, TEAL2)
    fdiamond(ax, 8.0, ys[3], 5.5, 1.0, "Record Count OK?", YELLOW)
    fconnect_d(ax, ys[3], ys[4], label="YES", color=BLUE)
    fbox(ax, 13.8, ys[3], 3.2, FH, "Alert & Retry", "Slack notification", RED)
    arrow(ax, 8.0 + 2.75, ys[3], 12.2, ys[3], "NO", RED)
    fbox(ax, 8.0, ys[4], FW, FH, "Insert to PostgreSQL",
         "standup_records · audit_logs", BLUE)
    fconnect(ax, ys[4], ys[5], color=BLUE)
    fbox(ax, 8.0, ys[5], FW, FH, "Generate Monthly Summary",
         "Statistics · attendance · topics", GREEN)
    fconnect(ax, ys[5], ys[6], color=GREEN)
    fbox(ax, 8.0, ys[6], 6.0, FH, "Email Report Sent",
         "SMTP · monthly digest", GREEN)
    ax.text(8.0, 0.55, "Python · Apache Airflow · PostgreSQL · Docker Compose · SMTP",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "backup-start-up", "flow.png")


def draw_rm2_flow():
    fig, ax = fig_setup()
    title_bar(ax, "Remote Meeting Prototype  —  Session Flow",
              "Unity · C# · Azure Speech-to-Text · REST API")
    phase_bar(ax, Y6[0] + FH/2, Y6[1] - FH/2, "SETUP",   TEAL)
    phase_bar(ax, Y6[1] + FH/2, Y6[4] - FH/2, "MEETING", BLUE)
    phase_bar(ax, Y6[4] + FH/2, Y6[6] - FH/2, "CLOSE",   GREEN)
    steps = [
        (Y6[0], "Host Creates Meeting Room",     "Unity scene init · room ID generated", TEAL),
        (Y6[1], "Guests Join via Link",          "Cross-platform · PCVR / desktop",      TEAL2),
        (Y6[2], "Audio Capture Starts",          "Microphone input · Unity stream",      BLUE),
        (Y6[3], "Azure Speech-to-Text",          "Real-time STT · multi-language",       BLUE),
        (Y6[4], "Subtitles & Emojis Displayed",  "Instant overlay · emoji reactions",    PURPLE),
        (Y6[5], "Meeting Ends",                  "Host terminates · disconnect all",     GRAY),
        (Y6[6], "Export Meeting Transcript",     "Timestamped log · meeting records",    GREEN),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    sidebar(ax, Y6[2], "REST API",      "Meeting objects · files",  GREEN)
    sidebar(ax, Y6[3], "Local Storage", "Session log · transcript", YELLOW)
    ax.text(8.0, 0.55, "Unity3D · C# · Azure Cognitive Services · SignalR · REST API · Meta Quest 3",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "rm2", "flow.png")


def draw_molrx_flow():
    fig, ax = fig_setup()
    title_bar(ax, "MolRx Visualization  —  VR Session Flow",
              "Unity3D · C# · Meta Quest 3 · Protein-Ligand Interaction")
    phase_bar(ax, Y6[0] + FH/2, Y6[1] - FH/2, "LOAD",     BLUE)
    phase_bar(ax, Y6[1] + FH/2, Y6[3] - FH/2, "RENDER",   PURPLE)
    phase_bar(ax, Y6[3] + FH/2, Y6[6] - FH/2, "INTERACT", TEAL)
    steps = [
        (Y6[0], "Load Molecule File",          ".pdb / .sdf / .mol2 format",            BLUE),
        (Y6[1], "Parse Atom Structure (C#)",   "Coordinates · bonds · charge",          BLUE),
        (Y6[2], "3D Render in Unity VR",       "Ball-stick · surface · electrostatics", PURPLE),
        (Y6[3], "User Enters VR Session",      "Meta Quest 3 · OpenXR standard",        PURPLE),
        (Y6[4], "VR Interaction",              "Grab · rotate · zoom · highlight site", TEAL),
        (Y6[5], "Capture Screenshot / Rec",    "PNG · MP4 · timestamped session log",   ORANGE),
        (Y6[6], "Share & Archive",             "Snapshot comparison · research notes",  GREEN),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    sidebar(ax, Y6[4], "Binding Site",   "Cavity detect · overlay",     RED)
    sidebar(ax, Y6[5], "Export Report",  "Session summary",             GREEN)
    ax.text(8.0, 0.55, "Unity3D · C# · Meta Quest 3 · OpenXR · Protein Data Bank",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "molrx", "flow.png")


def draw_remote_meeting_system_flow():
    fig, ax = fig_setup()
    title_bar(ax, "Meeting Room System  —  Boot & Monitor Flow",
              "Shell Script · Udev · Systemd · Uptime Kuma · Ubuntu")
    phase_bar(ax, Y6[0] + FH/2, Y6[1] - FH/2, "DETECT",  TEAL)
    phase_bar(ax, Y6[1] + FH/2, Y6[3] - FH/2, "BOOT",    BLUE)
    phase_bar(ax, Y6[3] + FH/2, Y6[6] - FH/2, "MONITOR", ORANGE)
    steps = [
        (Y6[0], "USB / HDMI Device Connected",  "Udev rule fires on hotplug",           TEAL),
        (Y6[1], "Udev Rule Triggers Script",    "Shell handler · device classification", TEAL2),
        (Y6[2], "Systemd Services Start",       "Display manager · audio routing",       BLUE),
        (Y6[3], "Display Configuration",        "xrandr · 2560×1080 · multi-monitor",    BLUE),
        (Y6[4], "Video Conf App Launched",      "Auto-start · window placement",         GREEN),
        (Y6[5], "Uptime Kuma Health Monitor",   "Black-box · Telegram alert on down",    ORANGE),
        (Y6[6], "Meeting Room Ready",           "All services healthy · stable",         GREEN),
    ]
    for cy, lbl, sub, c in steps:
        fbox(ax, 8.0, cy, FW, FH, lbl, sub, color=c)
    for i in range(len(steps) - 1):
        fconnect(ax, steps[i][0], steps[i + 1][0], color=steps[i][3])
    sidebar(ax, Y6[3], "PulseAudio",  "Audio routing · mic",   GRAY)
    sidebar(ax, Y6[5], "Alert on Down", "Telegram notification", RED)
    ax.text(8.0, 0.55, "Shell Script · Udev · Systemd · xrandr · PulseAudio · Uptime Kuma · Ubuntu",
            ha="center", va="center", color=GRAY, fontsize=8)
    _save(fig, "remote-meeting-system", "flow.png")


# ══════════════════════════════════════════════════════════════════════════════
# REGISTRY  project_id → {arch, flow}
# ══════════════════════════════════════════════════════════════════════════════

DIAGRAMS = {
    "ebook":                 {"arch": draw_ebook,                 "flow": draw_ebook_flow},
    "daodao":                {"arch": draw_daodao,                "flow": draw_daodao_flow},
    "gcp-livekit-infra":     {"arch": draw_gcp_livekit_infra,     "flow": draw_gcp_livekit_infra_flow},
    "stock-mlops":           {"arch": draw_stock_mlops,           "flow": draw_stock_mlops_flow},
    "llm-assistance":        {"arch": draw_llm_assistance,        "flow": draw_llm_assistance_flow},
    "de":                    {"arch": draw_de,                    "flow": draw_de_flow},
    "monitoring-system":     {"arch": draw_monitoring_system,     "flow": draw_monitoring_system_flow},
    "clothes":               {"arch": draw_clothes,               "flow": draw_clothes_flow},
    "aidc":                  {"arch": draw_aidc,                  "flow": draw_aidc_flow},
    "amd":                   {"arch": draw_amd,                   "flow": draw_amd_flow},
    "backup-start-up":       {"arch": draw_backup_start_up,       "flow": draw_backup_start_up_flow},
    "rm2":                   {"arch": draw_rm2,                   "flow": draw_rm2_flow},
    "molrx":                 {"arch": draw_molrx,                 "flow": draw_molrx_flow},
    "remote-meeting-system": {"arch": draw_remote_meeting_system, "flow": draw_remote_meeting_system_flow},
}

# Backward-compat alias used by older tooling
PROJECTS = {pid: fns["arch"] for pid, fns in DIAGRAMS.items()}


def main():
    parser = argparse.ArgumentParser(
        description="Generate portfolio diagrams (arch and/or flow)."
    )
    parser.add_argument(
        "projects", nargs="*",
        help="Project IDs to regenerate (default: all)",
    )
    parser.add_argument(
        "--type", choices=["arch", "flow", "all"], default="all",
        help="Which diagram type to generate (default: all)",
    )
    parser.add_argument(
        "--list", action="store_true",
        help="List available project IDs and exit",
    )
    args = parser.parse_args()

    if args.list:
        print("Available project IDs:")
        for pid in sorted(DIAGRAMS):
            print(f"  {pid}")
        return

    targets = args.projects if args.projects else list(DIAGRAMS.keys())
    unknown = [p for p in targets if p not in DIAGRAMS]
    if unknown:
        print(f"[ERROR] Unknown project(s): {', '.join(unknown)}", file=sys.stderr)
        print("Run with --list to see available IDs.", file=sys.stderr)
        sys.exit(1)

    types = ["arch", "flow"] if args.type == "all" else [args.type]
    os.makedirs(IMG_ROOT, exist_ok=True)
    print(f"Generating {len(targets) * len(types)} diagram(s)  [type={args.type}] ...")
    for pid in targets:
        for t in types:
            DIAGRAMS[pid][t]()
    print(f"\nDone. Output → {IMG_ROOT}")


if __name__ == "__main__":
    main()
