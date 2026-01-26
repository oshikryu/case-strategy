# O-1A Visa Application Assistant

A web application to help applicants compile and organize evidence for O-1A visa criteria assessment.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment

### GitHub Pages

The app is configured for static export and GitHub Pages deployment.

**Automatic Deployment (Recommended):**

1. Push to the `main` branch
2. Go to repository Settings > Pages
3. Under "Build and deployment", select **GitHub Actions**
4. The workflow will automatically build and deploy on each push

**Manual Deployment:**

```bash
npm run deploy
```

Or step by step:

```bash
npm run build:gh-pages
npx gh-pages -d out --dotfiles
```

Your site will be available at: `https://<username>.github.io/<repo-name>/`

### Other Platforms

The app exports as static HTML and can be deployed to any static hosting:

```bash
npm run build
# Deploy the 'out' directory to your hosting provider
```

## Application Flow

```
Landing Page (/)
    │
    ├── Demographics Form
    │
    ↓
Recommendations Page (/recommendations)
    │
    ├── Employment History
    ├── Education History
    ├── Professional Connections
    └── AI Recommendations
    │
    ↓
Criteria Page (/criteria)
    │
    ├── 8 O-1A Criteria Cards
    ├── Evidence Entry Modals
    └── Submit for Review (3+ criteria required)
    │
    ↓
Review Page (/review)
    │
    ├── Applicant View: Status & Feedback
    └── Reviewer View: Accept/Reject/Request Changes
```

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page with demographics form
│   ├── criteria/          # Criteria evidence page
│   ├── recommendations/   # Intake wizard for recommendations
│   └── review/            # Application review page
│
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── TextArea.tsx
│   │   ├── Modal.tsx
│   │   └── EvidenceInput.tsx
│   │
│   ├── landing/           # Landing page components
│   │   ├── DemographicForm.tsx
│   │   ├── PassportUpload.tsx
│   │   └── VisaTypeDropdown.tsx
│   │
│   ├── criteria/          # Criteria page components
│   │   ├── CriteriaGrid.tsx
│   │   ├── CriteriaCard.tsx
│   │   ├── ProgressBreadcrumb.tsx
│   │   └── modals/        # 8 criterion entry modals
│   │       ├── AwardsModal.tsx
│   │       ├── MembershipModal.tsx
│   │       ├── PublishedMaterialModal.tsx
│   │       ├── JudgingModal.tsx
│   │       ├── ContributionsModal.tsx
│   │       ├── AuthorshipModal.tsx
│   │       ├── CriticalEmploymentModal.tsx
│   │       └── RemunerationModal.tsx
│   │
│   ├── recommendations/   # Recommendation wizard components
│   │   ├── StepIndicator.tsx
│   │   ├── RecommendationsIntro.tsx
│   │   ├── EmploymentHistoryForm.tsx
│   │   ├── EducationHistoryForm.tsx
│   │   ├── ProfessionalConnectionsForm.tsx
│   │   └── RecommendationResults.tsx
│   │
│   ├── review/            # Review page components
│   │   ├── RoleToggle.tsx
│   │   ├── ReviewStatusBadge.tsx
│   │   ├── ReviewSummary.tsx
│   │   ├── ReviewCriteriaCard.tsx
│   │   ├── ReviewCriteriaGrid.tsx
│   │   ├── CriterionReviewModal.tsx
│   │   ├── EntryReviewCard.tsx
│   │   ├── ReviewActionButtons.tsx
│   │   └── ReviewCommentInput.tsx
│   │
│   └── layout/            # Layout components
│       ├── ClientLayout.tsx
│       └── SupportFooter.tsx
│
├── lib/
│   ├── stores/
│   │   └── useApplicationStore.ts  # Zustand state management
│   ├── constants/
│   │   ├── criteria.ts    # O-1A criteria definitions
│   │   └── visaTypes.ts   # Visa type enums
│   └── utils/
│       ├── index.ts
│       ├── imageHelpers.ts # Image compression utilities
│       └── intakeToCriteria.ts
│
└── types/
    └── index.ts           # TypeScript type definitions
```

## O-1A Criteria

The application supports all 8 O-1A extraordinary ability criteria:

| Criterion | Description |
|-----------|-------------|
| Awards | Nationally/internationally recognized prizes or awards |
| Membership | Membership in associations requiring outstanding achievement |
| Published Material | Published material about you in major media |
| Judging | Participation as a judge of others' work |
| Original Contributions | Original contributions of major significance |
| Scholarly Articles | Authorship of scholarly articles |
| Critical Employment | Employment in a critical capacity at distinguished organizations |
| High Remuneration | High salary compared to others in the field |

**Minimum requirement:** 3 of 8 criteria must be completed to submit for review.

## Validation

### Form Validation

All forms use **Zod** schemas for validation:

- **Demographics:** Name, address, country of birth, visa type required
- **Evidence Entries:** Required fields vary by criterion type
- **File Uploads:** Max 2MB per file, 10MB total; images auto-compressed

### Application State Validation

- Demographics must be completed before accessing other pages
- 3+ criteria must be marked complete before submitting for review
- Passport photo required before review submission

### Review Validation

- Reviewers can approve, reject, or request changes per criterion
- Overall status tracked: Approved/Rejected/Pending/Changes Requested

## State Management

Uses **Zustand** with localStorage persistence:

```typescript
// Key store actions
setDemographics(demographics)
addEntry(criterionType, entry)
updateEntry(criterionType, entryId, updates)
removeEntry(criterionType, entryId)
setCriterionComplete(criterionType, isComplete)
submitForReview()
setUserRole('applicant' | 'reviewer')
setCriterionReviewStatus(criterionType, status, comment)
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand with persist middleware
- **Forms:** React Hook Form + Zod
- **UI Components:** Radix UI (Dialog)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run build:gh-pages` | Build for GitHub Pages |
| `npm run deploy` | Build and deploy to GitHub Pages |

## Troubleshooting

### localStorage Quota Exceeded

If you see quota errors, clear the app's localStorage:

```javascript
localStorage.removeItem('o1a-visa-application')
```

### Images Not Loading

Images are compressed automatically. If issues persist, try a smaller image (< 2MB).

## Support

Click "Need Help? Contact Support" in the footer to send an email with your application details pre-filled.
