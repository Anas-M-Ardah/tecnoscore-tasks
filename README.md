# TecnoScore Task Desk · مكتب مهام تكنوسكور

A small bilingual (Arabic / English) task manager shared between **Anas** and **Zaid** for the TecnoScore plan.

- **People view:** each person's tasks, progress ring, and active / to-do / done groups.
- **Board view:** a Kanban board (To do → In progress → In review → Blocked → Done) with drag and drop.
- **Activity:** a timeline of who changed what.
- **Manager's brief:** automatic nudges about blocked or overdue work, idle teammates, tasks waiting for review, stale work, workload imbalance, linked tasks that need coordination, and the weekly pace needed to hit the target date.

## How it works

It's a static site hosted on GitHub Pages. All data lives in [`data/tasks.json`](data/tasks.json).

- **Viewing:** anyone with the link can see the plan.
- **Editing:** click ⚙ and paste a GitHub fine-grained token that has **Contents: Read and write** on this repo. Each change is committed to `data/tasks.json`, so you also get a full history in the commit log. The token is stored only in your browser.

### Giving Zaid edit access

Pick one:
1. Add Zaid as a collaborator (repo → Settings → Collaborators). Zaid then creates their own fine-grained token for this repo.
2. Or create a fine-grained token limited to this repo with Contents: Read and write, and send it to Zaid privately.

## Run locally

```bash
npx serve .
```
