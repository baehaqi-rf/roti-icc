---
trigger: always_on
description: Rules for Agent tool usage, command execution, and autonomous decision making.
---

# 🤖 Agentic Standards

## 1. Command Execution
**"Measure twice, cut once."**
1.  **Verify Context:** Check `pwd` before running commands.
2.  **Safety Check:** Review potentially destructive commands (`rm -rf`, `DROP TABLE`).
3.  **One-Shot:** Prefer commands that do the job in one go, but handle errors gracefully.
4.  **No Interactive Mode:** Use flags (`-y`, `--no-interactive`) to bypass prompts.

## 2. Tool Usage
1.  **Precision:** Use the right tool for the job (grep for search, view_file for reading).
2.  **Efficiency:** Batch operations where possible to save round-trips.
3.  **Feedback Loop:** Always check the output of a tool call before proceeding.

## 3. Reasoning
1.  **Chain of Thought:** "Let's think step by step." Break down complex problems.
2.  **Self-Correction:** If a tool fails, analyze *why* before retrying.
3.  **Proactive:** Don't ask the user for permission to fix a typo. Just fix it.
