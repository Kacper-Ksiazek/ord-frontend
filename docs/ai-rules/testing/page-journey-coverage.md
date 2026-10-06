# Page journey coverage

Posture of route pages against `e2e/journeys/`. Update this table in the same change that adds or removes a page. Rules: [`page-journey-coverage-posture.md`](./page-journey-coverage-posture.md), [`e2e-journey-for-new-user-flows.md`](./e2e-journey-for-new-user-flows.md).

| Route                   | Page                 | Journey or follow-up                                                                                                                                 | Posture   |
| ----------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `/login`                | login                | `e2e/journeys/00-auth-journey.spec.ts`                                                                                                               | covered   |
| `/`                     | home                 | —                                                                                                                                                    | uncovered |
| `/words`                | words inbox          | `e2e/journeys/03-words-capture-fill-ai-journey.spec.ts`, `e2e/journeys/04-words-generate-manual-journey.spec.ts`                                     | covered   |
| `/conversations`        | conversation list    | `e2e/journeys/01-core-flow-journey.spec.ts`, `e2e/journeys/02-resume-conversation-journey.spec.ts`, `e2e/journeys/05-explain-phrase-journey.spec.ts` | covered   |
| `/conversations/create` | create conversation  | `e2e/journeys/01-core-flow-journey.spec.ts`, `e2e/journeys/02-resume-conversation-journey.spec.ts`                                                   | covered   |
| `/conversations/[id]`   | conversation session | `e2e/journeys/02-resume-conversation-journey.spec.ts`                                                                                                | covered   |
