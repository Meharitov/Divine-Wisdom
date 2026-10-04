---
name: Dependency upgrade ordering
description: Package-manager conflict observed when refreshing the React and Drizzle dependency stacks together.
---

For broad dependency upgrades in this project, update React, React DOM, and their matching type packages separately before updating Drizzle ORM and the rest of the dependency set. A one-shot latest-version update failed npm peer resolution while Drizzle's optional native integrations were resolving React; staging React first allowed the remaining packages to install cleanly. Avoid forcing an unresolved peer tree.

**Why:** Keeping framework versions aligned before npm resolves Drizzle's optional integration graph prevented a failed all-at-once install.

**How to apply:** If a full dependency refresh returns ERESOLVE around Drizzle and React, upgrade React and its types first, then retry the remaining packages without `--force`.