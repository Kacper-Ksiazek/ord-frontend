# Jira Conventions

> **Cel pliku:** jak tworzyć i nazywać issue w projekcie ORDUI.  
> **Gdzie:** site, project key, epiki, JQL scope → `docs/jira/target.md`.

Identyfikatorem issue jest **klucz Jiry** (`ORDUI-42`) zwracany przez API — nie duplikuj go w polu `summary`.

---

## Hierarchia

```
Epic          → temat / inicjatywa (np. FDD Refactor)
  Task        → faza, feature chunk lub samodzielna jednostka pracy
    Subtask   → konkretny krok implementacyjny pod Taskiem
```

| Poziom  | Kiedy                                        | Issue type | Parent / link                 |
| ------- | -------------------------------------------- | ---------- | ----------------------------- |
| Epic    | Grupowanie większej inicjatywy               | Epic       | —                             |
| Task    | Faza refaktoru, feature, bugfix bez rozbicia | Task       | epic link (parent w next-gen) |
| Subtask | Atomowa praca pod istniejącym Taskiem        | Subtask    | `parent`: klucz Taska         |

**Epic:** szukaj po `summary` (patrz `target.md`), nie hardcoduj `ORDUI-*` w repo.

---

## Summary (tytuł)

Krótki, czytelny tytuł po polsku. **Bez prefiksów** ani tagów w summary — kontekst daje epic, projekt i klucz issue.

| Kontekst                 | Format              | Przykład                                    |
| ------------------------ | ------------------- | ------------------------------------------- |
| Faza w epicu FDD         | `Faza N — <cel>`    | `Faza 3 — enkapsulacja auth`                |
| Subtask                  | `<co> — <szczegół>` | `Przenieś authStore — features/auth/stores` |
| Samodzielny Task / Story | `<krótki tytuł>`    | `Login — walidacja OTP`                     |
| Bug                      | `<co nie działa>`   | `Sesja — SSE rozłącza się po idle`          |

W raportach i PR-ach podawaj **klucz Jiry** (`ORDUI-12`), nie prefiks w tytule.

---

## Issue types (ORDUI)

| Sytuacja               | Typ     |
| ---------------------- | ------- |
| Nowa praca (domyślnie) | Task    |
| User story / feature   | Story   |
| Błąd                   | Bug     |
| Krok pod Taskiem       | Subtask |
| Inicjatywa / grupa     | Epic    |

Nazwy typów są case-sensitive — używaj dokładnie jak w tabeli (zweryfikowane: `Subtask`, nie `Sub-task`).

---

## Statusy

Board ORDUI: **To Do** → **In Progress** → **Done**.

| Intencja        | Status      | Uwagi                                    |
| --------------- | ----------- | ---------------------------------------- |
| Nie zaczęte     | To Do       |                                          |
| W toku / review | In Progress | brak osobnego statusu review             |
| Ukończone       | Done        | resolution: Done                         |
| Anulowane       | Done        | resolution: Done + komentarz `cancelled` |

Zmiana statusu: `getTransitionsForJiraIssue` → `transitionJiraIssue` (nigdy bezpośrednio pole `status`).

---

## Domyślne pola (nowe issue)

| Pole                | Wartość                             |
| ------------------- | ----------------------------------- |
| Priority            | Medium                              |
| Assignee            | nie ustawiaj (chyba że user wskaże) |
| Labels / Components | nie ustawiaj (chyba że user wskaże) |

---

## Szablon opisu

```markdown
## Kontekst

<!-- dlaczego ten issue istnieje -->

## Kryteria akceptacji

- [ ] ...

## Linki

- Jira: ORDUI-…
- Branch/PR: ...
- Docs: ...

## Definition of Done

- [ ] ...
```

---

## Reguły dla agenta

1. **Search-before-create** — szukaj duplikatu po `summary` w `project = ORDUI` zanim utworzysz issue.
2. **Klucz z API** — po utworzeniu używaj `ORDUI-N` w odpowiedziach i linkach; nie zakładaj numeru z góry.
3. **Epic** — przed linkowaniem znajdź epic JQL-em z `target.md`.
4. **Subtask** — wymaga `parent` (klucz Taska) i typu `Subtask`.
5. **Zapis do Jiry** — skill `jira-manage-tasks` (preview → OK użytkownika → MCP).
