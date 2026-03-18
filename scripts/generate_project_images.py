"""
Generate architecture diagram images for portfolio projects.
Output: public/images/portfolio/{ebook,daodao,gcp-livekit-infra}.png
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patheffects as pe
import numpy as np

OUTPUT_DIR = r"D:\projects\self-reusme-website\public\images\portfolio"

# ── Color Palette ──────────────────────────────────────────────
BG       = "#0f172a"   # dark navy
PANEL    = "#1e293b"   # slightly lighter panel
CARD     = "#1a2744"   # card bg
TEAL     = "#38b2ac"   # accent
TEAL2    = "#4fd1c5"   # lighter teal
BLUE     = "#3b82f6"   # blue accent
PURPLE   = "#7c3aed"   # purple accent
GREEN    = "#22c55e"   # green
ORANGE   = "#f97316"   # orange
WHITE    = "#f8fafc"
GRAY     = "#94a3b8"
BORDER   = "#334155"

def fig_setup(w=16, h=10):
    fig, ax = plt.subplots(figsize=(w, h))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 10)
    ax.axis("off")
    return fig, ax

def box(ax, x, y, w, h, label, sublabel=None,
        color=TEAL, bg=PANEL, fontsize=11, radius=0.3):
    rect = FancyBboxPatch(
        (x, y), w, h,
        boxstyle=f"round,pad=0.05,rounding_size={radius}",
        linewidth=1.5, edgecolor=color, facecolor=bg
    )
    ax.add_patch(rect)
    ty = y + h / 2 + (0.18 if sublabel else 0)
    ax.text(x + w/2, ty, label,
            ha="center", va="center",
            color=WHITE, fontsize=fontsize, fontweight="bold")
    if sublabel:
        ax.text(x + w/2, y + h/2 - 0.22, sublabel,
                ha="center", va="center",
                color=GRAY, fontsize=8)

def arrow(ax, x1, y1, x2, y2, label=None, color=TEAL):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(
                    arrowstyle="-|>",
                    color=color,
                    lw=1.8,
                    mutation_scale=18
                ))
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        ax.text(mx+0.05, my+0.12, label,
                color=color, fontsize=8, ha="center")

def arrow_lr(ax, x1, y1, x2, y2, label=None, color=TEAL):
    """Bidirectional arrow."""
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="<|-|>", color=color,
                                lw=1.8, mutation_scale=16))
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        ax.text(mx, my+0.15, label, color=color, fontsize=8, ha="center")

def title_bar(ax, text, subtitle=None):
    ax.add_patch(FancyBboxPatch((0.3, 9.1), 15.4, 0.7,
                                boxstyle="round,pad=0.05,rounding_size=0.2",
                                linewidth=0, facecolor=TEAL, alpha=0.15))
    ax.plot([0.5, 15.5], [9.1, 9.1], color=TEAL, lw=1.5, alpha=0.5)
    ax.text(8, 9.5, text, ha="center", va="center",
            color=TEAL2, fontsize=16, fontweight="bold")
    if subtitle:
        ax.text(8, 9.15, subtitle, ha="center", va="center",
                color=GRAY, fontsize=9)

def tag(ax, x, y, text, color=TEAL):
    ax.text(x, y, f"  {text}  ",
            ha="center", va="center", color=WHITE,
            fontsize=8, fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.25", facecolor=color,
                      edgecolor="none", alpha=0.85))

def section_label(ax, x, y, w, text, color=BLUE):
    ax.text(x + w/2, y, text,
            ha="center", va="center",
            color=color, fontsize=9, fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.2", facecolor=BG,
                      edgecolor=color, linewidth=1))


# ─────────────────────────────────────────────────────────────────
# 1. EBOOK READER
# ─────────────────────────────────────────────────────────────────
def draw_ebook():
    fig, ax = fig_setup()
    title_bar(ax, "Ebook Reader  —  System Architecture",
              "React 19 · Chakra UI · Supabase · React PDF Viewer · IndexedDB")

    # ── GitHub OAuth → Login ──
    box(ax, 0.5, 7.0, 2.2, 0.9, "GitHub OAuth", "Identity Provider",
        color=GREEN, bg="#14291a")
    box(ax, 3.5, 7.0, 2.5, 0.9, "Login Page", "/ (route)",
        color=TEAL, bg=CARD)
    arrow(ax, 2.72, 7.45, 3.48, 7.45, "OAuth callback", TEAL2)

    # ── Dashboard ──
    box(ax, 3.0, 5.0, 10.0, 1.6, "", color=BLUE, bg="#0d1f3a")
    ax.text(8.0, 6.3, "Dashboard  (/dashboard)",
            ha="center", va="center", color=BLUE, fontsize=12, fontweight="bold")
    # sub-items
    items = ["Book Library (Grid)", "Upload PDF", "Search & Filter",
             "Statistics (Chart.js)", "Category / Status badges"]
    for i, it in enumerate(items):
        col = 3.3 + i * 2.0
        ax.text(col, 5.55, f"• {it}", ha="left", va="center",
                color=GRAY, fontsize=7.5)

    arrow(ax, 6.0, 6.95, 6.0, 6.62, color=BLUE)

    # ── Reader ──
    box(ax, 3.0, 3.0, 10.0, 1.6, "", color=PURPLE, bg="#160d2a")
    ax.text(8.0, 4.3, "PDF Reader  (/reader/:bookId)",
            ha="center", va="center", color=PURPLE, fontsize=12, fontweight="bold")
    reader_items = ["Page Navigation", "Progress Auto-save", "Resume Last Page",
                    "Dark Mode Toggle", "React PDF Viewer"]
    for i, it in enumerate(reader_items):
        col = 3.3 + i * 2.0
        ax.text(col, 3.55, f"• {it}", ha="left", va="center",
                color=GRAY, fontsize=7.5)
    arrow(ax, 8.0, 4.98, 8.0, 4.62, color=PURPLE)

    # ── Supabase ──
    box(ax, 0.5, 0.8, 4.5, 1.8, "Supabase (Cloud)",
        "Auth · Storage · PostgreSQL", color=TEAL, bg=CARD)
    # ── IndexedDB ──
    box(ax, 6.2, 0.8, 4.5, 1.8, "IndexedDB (Local)",
        "Offline Cache · PDF Blob · Metadata", color=ORANGE, bg="#2a1a0a")

    # sync arrows
    arrow_lr(ax, 5.02, 1.7, 6.18, 1.7, "sync", TEAL)
    # data flow up
    arrow(ax, 2.75, 2.62, 2.75, 2.98, color=TEAL)
    arrow(ax, 8.45, 2.62, 8.45, 2.98, color=ORANGE)

    # BookManager
    box(ax, 11.5, 0.8, 4.0, 1.8, "BookManager.js",
        "Upload · CRUD · Progress", color=GRAY, bg=PANEL)
    ax.text(13.5, 0.5, "Framer Motion · Chart.js",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    path = os.path.join(OUTPUT_DIR, "ebook.png")
    fig.savefig(path, dpi=120, bbox_inches="tight", facecolor=BG)
    plt.close(fig)
    print(f"Saved: ebook.png")


# ─────────────────────────────────────────────────────────────────
# 2. DAODAO – ETL Pipeline
# ─────────────────────────────────────────────────────────────────
def draw_daodao():
    fig, ax = fig_setup()
    title_bar(ax, "DaoDAO Education Platform  —  ETL Pipeline Architecture",
              "Apache Airflow · MongoDB · Notion API · PostgreSQL · Next.js")

    # ── Data Sources ──
    section_label(ax, 0.4, 8.85, 6.8, "DATA SOURCES", GRAY)
    box(ax, 0.5, 7.6, 3.0, 1.0, "MongoDB", "users · activities · marathons",
        color=GREEN, bg="#0f2a1a")
    box(ax, 4.2, 7.6, 3.0, 1.0, "Notion API", "Store · Resources",
        color="#6b7280", bg="#1e2030")

    # arrows down to Airflow
    arrow(ax, 2.0, 7.58, 2.0, 6.78, color=GREEN)
    arrow(ax, 5.7, 7.58, 5.7, 6.78, color=GRAY)

    # ── Airflow (ETL Core) ──
    ax.add_patch(FancyBboxPatch((0.4, 5.3), 10.5, 1.38,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=ORANGE, facecolor="#1a1000"))
    ax.text(5.65, 6.48, "Apache Airflow  —  DAG Orchestration",
            ha="center", va="center", color=ORANGE, fontsize=12, fontweight="bold")

    dags = [
        ("Activities DAG", "Daily", GREEN),
        ("Users DAG", "Monthly", TEAL),
        ("Store DAG", "Daily", BLUE),
        ("Resources DAG", "Monthly", PURPLE),
    ]
    for i, (name, freq, c) in enumerate(dags):
        bx = 0.6 + i * 2.62
        box(ax, bx, 5.38, 2.4, 0.78, name, freq, color=c, bg=PANEL, fontsize=9)

    # Extract → Transform → Load label
    for i, step in enumerate(["Extract", "Transform", "Load"]):
        ax.text(11.5 + i * 0, 5.98 - i * 0, step,
                ha="center", va="center", color=ORANGE, fontsize=9)
    ax.text(12.5, 5.98, "Extract → Transform → Load",
            ha="center", va="center", color=ORANGE, fontsize=9, alpha=0.7)

    # Airflow → Staging
    arrow(ax, 5.65, 5.28, 5.65, 4.68, color=ORANGE)

    # ── Staging Tables ──
    box(ax, 0.5, 3.6, 10.5, 0.98, "Staging Tables (PostgreSQL)",
        "old_user  ·  old_activities  ·  old_marathons  ·  old_store  ·  old_resource",
        color=GRAY, bg=PANEL, fontsize=10)

    # Staging → Migration
    arrow(ax, 5.65, 3.58, 5.65, 3.05, color=GRAY)

    # Migration Tasks
    ax.text(5.65, 2.92, "Migration & Normalization Tasks",
            ha="center", va="center", color=BLUE, fontsize=9,
            bbox=dict(boxstyle="round,pad=0.2", facecolor=BG,
                      edgecolor=BLUE, linewidth=1))

    # Migration → PostgreSQL
    arrow(ax, 5.65, 2.72, 5.65, 2.22, color=BLUE)

    # ── Normalized PostgreSQL ──
    ax.add_patch(FancyBboxPatch((0.4, 0.9), 10.5, 1.22,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=2, edgecolor=BLUE, facecolor="#0a1628"))
    ax.text(5.65, 1.85, "PostgreSQL  —  Normalized Schema",
            ha="center", va="center", color=BLUE, fontsize=12, fontweight="bold")
    tables = ["Users", "Projects", "Marathons", "Groups", "Store", "Resources"]
    for i, t in enumerate(tables):
        tag(ax, 1.2 + i * 1.7, 1.12, t, BLUE)

    # ── Frontend ──
    box(ax, 11.5, 5.5, 4.0, 0.9, "Next.js Web", "Product Platform (port 3001)",
        color=TEAL, bg=CARD, fontsize=10)
    box(ax, 11.5, 4.3, 4.0, 0.9, "React Native", "Mobile App (Expo)",
        color=TEAL2, bg=CARD, fontsize=10)

    arrow(ax, 10.92, 1.5, 11.48, 5.7, color=TEAL)
    arrow(ax, 10.92, 1.5, 11.48, 4.5, color=TEAL2)

    ax.text(5.65, 0.55, "Docker Compose · Ansible · Python · Pandas · SQLAlchemy",
            ha="center", va="center", color=GRAY, fontsize=8)

    plt.tight_layout(pad=0.5)
    path = os.path.join(OUTPUT_DIR, "daodao.png")
    fig.savefig(path, dpi=120, bbox_inches="tight", facecolor=BG)
    plt.close(fig)
    print(f"Saved: daodao.png")


# ─────────────────────────────────────────────────────────────────
# 3. GCP LIVEKIT INFRA
# ─────────────────────────────────────────────────────────────────
def draw_gcp():
    fig, ax = fig_setup()
    title_bar(ax, "Low Vision Glasses  —  GCP Cloud Architecture",
              "GCP · LiveKit WebRTC · FastAPI · Firebase Auth · Ansible IaC")

    # ── Client ──
    box(ax, 0.4, 7.6, 2.5, 1.0, "Client App", "Low Vision Glasses",
        color=TEAL, bg=CARD)
    ax.text(1.65, 7.25, "HTTPS / WSS / WebRTC UDP", ha="center",
            va="center", color=GRAY, fontsize=7.5)

    # ── Firebase Auth ──
    box(ax, 4.0, 7.6, 3.0, 1.0, "Firebase Auth",
        "GitHub / Google OAuth · JWT", color=ORANGE, bg="#2a1400")
    arrow(ax, 2.92, 8.1, 3.98, 8.1, "Auth Request", ORANGE)

    # ── GCP VPC border ──
    ax.add_patch(FancyBboxPatch((0.3, 0.6), 15.2, 6.6,
                                boxstyle="round,pad=0.1,rounding_size=0.4",
                                linewidth=2.5, edgecolor="#4285F4",
                                facecolor="#030d1f", zorder=0))
    ax.text(8.0, 7.05, "GCP VPC  (Isolated Network)",
            ha="center", va="center", color="#4285F4",
            fontsize=10, fontweight="bold", alpha=0.8)

    # Firewall label
    ax.text(8.0, 6.75, "Ingress / Egress Firewall Rules  (Min Privilege)",
            ha="center", va="center", color=GRAY, fontsize=8.5, style="italic")
    ax.plot([0.5, 15.5], [6.6, 6.6], color="#334155", lw=1.2, ls="--", alpha=0.6)

    # ── Public Subnet ──
    ax.add_patch(FancyBboxPatch((0.6, 3.5), 7.0, 2.8,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=1.5, edgecolor=TEAL,
                                facecolor="#0a1e20", zorder=1))
    ax.text(4.1, 6.12, "Public Subnet",
            ha="center", va="center", color=TEAL, fontsize=9, fontweight="bold")

    # Token Service
    box(ax, 0.8, 4.7, 3.0, 1.2, "Token Service", "FastAPI · JWT Signing",
        color=BLUE, bg="#0a1628", fontsize=10)
    # WebRTC Server
    box(ax, 4.5, 4.7, 2.8, 1.2, "WebRTC Server", "LiveKit · UDP / SRTP",
        color=TEAL, bg=CARD, fontsize=10)

    # Arrows
    arrow(ax, 4.45, 8.1, 3.65, 6.0, "JWT Token", BLUE)   # Firebase → Token Service
    arrow(ax, 3.82, 5.3, 4.48, 5.3, "token", TEAL2)       # Token → WebRTC
    arrow(ax, 4.5, 4.2, 4.1, 4.2, color=TEAL)             # WebRTC ↔ Client implied

    # Client to WebRTC label
    ax.text(3.2, 3.7, "WebRTC / UDP (media stream)", ha="center",
            va="center", color=TEAL, fontsize=7.5, style="italic")

    # ── Private Subnet ──
    ax.add_patch(FancyBboxPatch((8.2, 3.5), 7.0, 2.8,
                                boxstyle="round,pad=0.1,rounding_size=0.3",
                                linewidth=1.5, edgecolor=PURPLE,
                                facecolor="#160d2a", zorder=1))
    ax.text(11.7, 6.12, "Private Subnet",
            ha="center", va="center", color=PURPLE, fontsize=9, fontweight="bold")

    # AI Agent Backend
    box(ax, 8.5, 4.5, 6.5, 1.6, "AI Agent Backend",
        "LLM Processing · Task Scheduling · Internal APIs",
        color=PURPLE, bg="#1a0a2e", fontsize=11)

    # WebRTC → AI Agent
    arrow(ax, 7.62, 5.2, 8.48, 5.2, "Internal API", PURPLE)

    # ── Ansible IaC ──
    box(ax, 0.8, 1.0, 4.5, 1.8, "Ansible IaC",
        "Multi-env Deployment · Idempotent Playbooks",
        color=GREEN, bg="#0a1a0f", fontsize=10)
    ax.text(3.05, 0.75, "Dev / Staging / Production", ha="center",
            va="center", color=GRAY, fontsize=7.5)

    # Ansible deploy arrows
    arrow(ax, 3.05, 2.82, 2.3, 3.48, color=GREEN)
    arrow(ax, 3.05, 2.82, 5.9, 3.48, color=GREEN)
    arrow(ax, 3.05, 2.82, 11.7, 3.48, color=GREEN)

    # ── GCP Services sidebar ──
    box(ax, 11.0, 1.0, 4.3, 2.2, "GCP Services",
        "Cloud Compute · VPC · IAM · Firewall",
        color="#4285F4", bg="#0a1020", fontsize=10)
    tags_gcp = ["Compute Engine", "Cloud VPC", "Cloud IAM", "Firebase"]
    for i, t in enumerate(tags_gcp):
        tag(ax, 11.4 + (i % 2) * 2.0, 1.5 - (i // 2) * 0.55, t, "#4285F4")

    plt.tight_layout(pad=0.5)
    path = os.path.join(OUTPUT_DIR, "gcp-livekit-infra.png")
    fig.savefig(path, dpi=120, bbox_inches="tight", facecolor=BG)
    plt.close(fig)
    print(f"Saved: gcp-livekit-infra.png")


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    draw_ebook()
    draw_daodao()
    draw_gcp()
    print("\nAll images generated.")
