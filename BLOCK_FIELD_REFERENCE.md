# BLOCK FIELD REFERENCE (Tier 1 — GENERATED, DO NOT HAND-EDIT)

> Source hash `d5b673883006` (sha256 of interactive-course.html, first 12) by `server/src/scripts/generateBlockFieldReference.js`.
> **Source of truth:** the `renderX()` functions in `client/public/interactive-course.html`.
> Field names below are extracted from `block.<field>` reads in those functions.
> If a seed or the builder writes a field NOT listed here, the viewer ignores it
> and the block renders incomplete or blank. **The viewer wins over every spec doc.**
>
> Regenerate after ANY change to a block render function. Never edit this file by hand.

## ⚠ Cross-block field-name divergence (the silent-blank trap)

The `image` and `imageText` blocks use DIFFERENT names for the same concepts.
Wiring an uploader's generic `{url, alt}` output to the wrong names = block saves,
word count unaffected, but renders blank.

| Concept | `image` block | `imageText` block |
|---|---|---|
| image source | `imageUrl` | `image` |
| alt text | `imageAltText` | `imageAlt` |
| caption | `imageCaption` | (none) |
| size control | `imageSize` ('small'|'medium'|'large') | (none) |
| alignment | `imageAlignment` ('left'|'center'|'right') | (none) |
| position flip | (none) | `imagePosition` ('left'|'right') |
| highlight bg | (none) | `highlight` (boolean) |

## All block types (extracted)

### `sectionDivider`  ·  renders via `renderSectionDivider()`
| field | classification |
|---|---|
| `bannerAlt` | data |
| `bannerImage` | data |
| `sectionNumber` | data |
| `subtitle` | prose (word-counted) |
| `title` | prose (word-counted) |

### `text`  ·  renders via `renderText()`
| field | classification |
|---|---|
| `callouts` | data |
| `content` | prose (word-counted) |
| `textContent` | data |

### `imageText`  ·  renders via `renderImageText()`
| field | classification |
|---|---|
| `callouts` | data |
| `content` | prose (word-counted) |
| `highlight` | layout/asset (not counted) |
| `image` | layout/asset (not counted) |
| `imageAlt` | layout/asset (not counted) |
| `imagePosition` | layout/asset (not counted) |
| `title` | prose (word-counted) |

### `image`  ·  renders via `renderImage()`
| field | classification |
|---|---|
| `imageAlignment` | layout/asset (not counted) |
| `imageAltText` | layout/asset (not counted) |
| `imageCaption` | data |
| `imageSize` | layout/asset (not counted) |
| `imageUrl` | layout/asset (not counted) |

### `accordion`  ·  renders via `renderAccordion()`
| field | classification |
|---|---|
| `accordionItems` | data |

### `multipleChoice`  ·  renders via `renderMultipleChoice()`
| field | classification |
|---|---|
| `correctAnswer` | data |
| `explanation` | data |
| `options` | data |
| `question` | prose (word-counted) |

### `transcriptCoding`  ·  renders via `renderTranscriptCoding()`
| field | classification |
|---|---|
| `codingQuestion` | data |
| `correctAnswer` | data |
| `explanation` | data |
| `options` | data |
| `transcript` | data |

### `multiSelect`  ·  renders via `renderMultiSelect()`
| field | classification |
|---|---|
| `explanation` | data |
| `options` | data |
| `question` | prose (word-counted) |

### `matching`  ·  renders via `renderMatching()`
| field | classification |
|---|---|
| `matchingInstructions` | data |
| `matchingPairs` | data |

### `flashcardDeck`  ·  renders via `renderFlashcardDeck()`
| field | classification |
|---|---|
| `flashcards` | data |
| `instructions` | data |

### `scenarioTree`  ·  renders via `renderScenarioTree()`
| field | classification |
|---|---|
| `instructions` | data |
| `nodes` | data |
| `scenarioTitle` | data |
| `startNode` | data |

### `cardSort`  ·  renders via `renderCardSort()`
| field | classification |
|---|---|
| `cards` | data |
| `categories` | data |
| `explanation` | data |
| `instructions` | data |

### `sequencing`  ·  renders via `renderSequencing()`
| field | classification |
|---|---|
| `explanation` | data |
| `instructions` | data |
| `steps` | data |

### `timeline`  ·  renders via `renderTimeline()`
| field | classification |
|---|---|
| `events` | data |

### `hotspot`  ·  renders via `renderHotspot()`
| field | classification |
|---|---|
| `hotspotImage` | data |
| `hotspots` | layout/asset (not counted) |
| `imageDescription` | data |
| `instructions` | data |

### `reflection`  ·  renders via `renderReflection()`
| field | classification |
|---|---|
| `minLength` | data |
| `question` | prose (word-counted) |

### `callout`  ·  renders via `renderCallout()`
| field | classification |
|---|---|
| `calloutItems` | data |
| `calloutType` | data |
| `content` | prose (word-counted) |
| `items` | data |
| `title` | prose (word-counted) |
| `variant` | data |

### `fillInBlank`  ·  renders via `renderFillInBlank()`
| field | classification |
|---|---|
| `blanks` | data |
| `title` | prose (word-counted) |

### `keyTakeaway`  ·  renders via `renderKeyTakeaway()`
| field | classification |
|---|---|
| `content` | prose (word-counted) |
| `items` | data |
| `takeaways` | data |
| `title` | prose (word-counted) |

### `preCommit`  ·  renders via `renderPreCommit()`
| field | classification |
|---|---|
| `preCommitId` | data |
| `question` | prose (word-counted) |

### `preCommitReveal`  ·  renders via `renderPreCommitReveal()`
| field | classification |
|---|---|
| `modelResponse` | data |
| `preCommitId` | data |

### `pulseCheck`  ·  renders via `renderPulseCheck()`
> ⚠ render function not found — verify the name in the viewer.

### `statCard`  ·  renders via `renderStatCard()`
| field | classification |
|---|---|
| `stats` | data |
| `title` | prose (word-counted) |

### `caseStudy`  ·  renders via `renderCaseStudy()`
| field | classification |
|---|---|
| `caseBackground` | data |
| `caseClient` | data |
| `caseClinicianNotes` | data |
| `caseDiscussion` | data |
| `casePresentingConcerns` | data |
| `caseTitle` | data |

### `pullQuote`  ·  renders via `renderPullQuote()`
| field | classification |
|---|---|
| `attribution` | data |
| `quote` | prose (word-counted) |

### `table`  ·  renders via `renderTableBlock()`
| field | classification |
|---|---|
| `tableCaption` | data |
| `tableHeaders` | data |
| `tableRows` | data |
| `title` | prose (word-counted) |

### `resources`  ·  renders via `renderResources()`
| field | classification |
|---|---|
| `deliverables` | data |
| `files` | data |
| `resources` | data |

### `videoEmbed`  ·  renders via `renderVideoEmbed()`
| field | classification |
|---|---|
| `markers` | data |
| `videoDuration` | data |
| `videoStatus` | data |
| `videoTitle` | data |
| `videoUrl` | layout/asset (not counted) |

## Viewer-supported block types

`sectionDivider`, `text`, `imageText`, `image`, `accordion`, `multipleChoice`, `transcriptCoding`, `multiSelect`, `matching`, `flashcardDeck`, `scenarioTree`, `cardSort`, `sequencing`, `timeline`, `hotspot`, `reflection`, `callout`, `fillInBlank`, `keyTakeaway`, `preCommit`, `preCommitReveal`, `statCard`, `caseStudy`, `pullQuote`, `table`, `resources`, `videoEmbed`

> If the course builder's block picker offers fewer types than this list,
> the missing ones are unexposed capability — they render fine if seeded, but
> authors can't add them via the UI. Candidates to expose for layout variety:
> `statCard`, `pullQuote`, `caseStudy`, `keyTakeaway`, `table`, `timeline`, `callout`.

## Schema-declared top-level paths (context only)

_From InteractiveCourse.js. Strict mode silently drops undeclared fields on save._

`accessType`, `accredited`, `acepNumber`, `action`, `approvalBody`, `approvalDate`, `assessment`, `assessmentPassed`, `attemptedAt`, `attemptsAllowed`, `attestationAgreed`, `attestationRequired`, `attestationText`, `blockId`, `blockIndex`, `blockType`, `body`, `calloutType`, `category`, `ceHours`, `ceProvider`, `certificateEnabled`, `certificateId`, `confidence`, `courseCode`, `courseId`, `currentSectionIndex`, `deliveryFormat`, `description`, `dripEnabled`, `dripIntervalMinutes`, `dripSectionsPerInterval`, `enforceSectionOrder`, `enrolledAt`, `estimatedTime`, `evaluationId`, `evaluationSubmitted`, `expirationDate`, `hasQuiz`, `highlight`, `hours`, `imageAlignment`, `imagePosition`, `imageSize`, `isActive`, `isPublished`, `label`, `lastAccessedAt`, `maxAttempts`, `message`, `minLength`, `minimumTimeMinutes`, `narrationEnabled`, `nodes`, `notes`, `order`, `overallProgress`, `partnerId`, `passThreshold`, `passingScore`, `presenter`, `previousSectionsReviewable`, `providerName`, `providerNumber`, `quizPassThreshold`, `quizPassed`, `reviewAudit`, `reviewFeeCents`, `reviewStatus`, `sectionId`, `sectionIndex`, `shuffleOptions`, `shuffleQuestions`, `slug`, `source`, `startNode`, `status`, `timeLimit`, `timeSpent`, `timestamp`, `title`, `totalTimeSpent`, `type`, `updatedAt`, `userId`, `visibility`
