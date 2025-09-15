# **Project Backlog & Sprint 0 Plan: FlowSync AI (v1.3)**

## **Epics, User Stories & Acceptance Criteria**

**Epic 1: Foundation & Core Platform**
*   **Description:** Establish the foundational infrastructure, user management, and core data models for the entire platform.
*   **Priority:** Must Have (MVP)

**Epic 2: Manual Event Hub**
*   **Description:** Implement the primary human-in-the-loop interface, allowing users across all functions to report status manually via multiple channels.
*   **Priority:** Must Have (MVP)

**Epic 3: GitHub Integration & Automated Signal Processing**
*   **Description:** Ingest, validate, and process development signals from GitHub to build the technical side of the context graph.
*   **Priority:** Must Have (MVP)

**Epic 4: Universal Activity Feed & Dashboard**
*   **Description:** Create the primary web UI for viewing the cross-functional activity feed and project status.
*   **Priority:** Must Have (MVP)

**Epic 5: Cross-Functional Onboarding & Activation**
*   **Description:** Guide users of all roles from sign-up to their first moment of value (reporting or receiving status).
*   **Priority:** Must Have (MVP)

**Epic 6: Basic Confidence Scoring & Provenance**
*   **Description:** Implement the foundational framework for calculating, storing, and displaying confidence levels and source provenance on all data.
*   **Priority:** Should Have (v1.0)

**Epic 7: Admin Guardrails & Configuration**
*   **Description:** Provide administrators with the tools to configure automation rules and confidence thresholds.
*   **Priority:** Could Have (v1.0)

---
*(Note: Epics for Jira/Linear, Figma, Confluence, Finance Reporting, and Advanced Chatbot are planned for later versions.)*
---

### **User Stories & Acceptance Criteria**

**Epic 1: Foundation & Core Platform**
*   **User Story 1.1:** As a new user, I want to sign up using my GitHub OAuth account so that I don't have to create a new password.
    *   **AC1:** Given I am on the landing page, when I click "Sign up with GitHub", I am redirected to GitHub's OAuth screen.
    *   **AC2:** Given I successfully authenticate with GitHub, my user account is created in PostgreSQL, and I am logged into the FlowSync AI web app.
*   **User Story 1.2:** As a logged-in user, I want to create a new "Project" to represent a team, epic, or initiative I want to monitor.
    *   **AC1:** Given I am on the dashboard, I can click a "New Project" button, provide a name, description, and a unique `#tag`, and save it.
    *   **AC2:** Upon creation, the project is stored in the database, I am set as its admin, and the `#tag` is available for use in manual reports.
*   **User Story 1.3:** As the system, I want all events to be processed asynchronously via a message queue to ensure resilience and scalability.
    *   **AC1:** Given any event (webhook or manual), it is placed into a Kafka topic.
    *   **AC2:** A separate consumer service processes events from the topic and writes them to the database and graph.

**Epic 2: Manual Event Hub**
*   **User Story 2.1:** As any user, I want to report my status by sending a Slack slash command (`/flowsync [message]`) so it's quick and frictionless.
    *   **AC1:** Given I am in a connected Slack workspace, when I type `/flowsync Finished the login page mockups #project-alpha`, the command is received by our API.
    *   **AC2:** The system validates my identity and replies instantly in the thread with "✅ Status received."
    *   **AC3:** The message and its `#project-alpha` tag are parsed and placed in the message queue for processing.
*   **User Story 2.2:** As a user without Slack, I want to report my status via a simple form in the web app.
    *   **AC1:** Given I am logged into the web app, I can click a "+ Report Status" button.
    *   **AC2:** A modal opens with a text input and a suggester for existing project `#tags`.
    *   **AC3:** When I submit, the event is treated identically to a Slack-sourced event.
*   **User Story 2.3:** As the system, I want to store all manual events with a `source: manual_user_report` provenance tag and a full audit trail.
    *   **AC1:** Given a manual event is processed, a `ManualEvent` node is created in Neo4j with properties: `userId`, `source` (`slack`/`web`), `message`, `timestamp`.
    *   **AC2:** This node is linked to any `Project` node via the parsed `#tag`.

**Epic 3: GitHub Integration & Automated Signal Processing**
*   **User Story 3.1:** As a project admin, I want to connect my GitHub repository to my FlowSync project.
    *   **AC1:** Given I am in the project settings, I can see an "Integrations" section with a "Connect GitHub" button.
    *   **AC2:** When I click it, I am guided through an OAuth flow to install a GitHub app and select a repository.
*   **User Story 3.2:** As the system, I want to receive GitHub webhooks for PR events and create corresponding nodes in the graph.
    *   **AC1:** Given a webhook for a `pull_request` event is received, a `PullRequest` node is created/updated in Neo4j with key properties (`title`, `state`, `number`, `url`).
    *   **AC2:** The `PullRequest` node is linked to a `User` node (author) and to any `Project` node mentioned in the PR title or branch name (e.g., `feat/PROJ-123` links to `#PROJ-123`).

**Epic 4: Universal Activity Feed & Dashboard**
*   **User Story 4.1:** As a user, I want to see a unified activity feed that combines manual reports and automated events from all my projects.
    *   **AC1:** Given I am on the dashboard, I see a chronological feed of events.
    *   **AC2:** Each event card is visually distinct based on its source (Manual vs. GitHub).
    *   **AC3:** I can filter the feed by source (All, Manual, GitHub) and by project `#tag`.
*   **User Story 4.2:** As a user, I want to view a status page for a specific project that aggregates all its related activity.
    *   **AC1:** Given I click on a project name or `#tag`, I am taken to a dedicated project page.
    *   **AC2:** This page shows a filtered activity feed containing only events tagged with that project.
    *   **AC3:** The page shows a summary of the project's current state (e.g., "Active", "No recent activity").

**Epic 5: Cross-Functional Onboarding & Activation**
*   **User Story 5.1:** As a new user, I am asked for my role during onboarding so the experience can be tailored for me.
    *   **AC1:** After sign-up, a screen prompts me to select my role (Engineer, Designer, Product Manager, Other).
    *   **AC2:** My selection is stored in my user profile.
*   **User Story 5.2:** As a new user, the onboarding flow guides me to immediately experience the core value of manual reporting.
    *   **AC1:** After role selection, the onboarding wizard's first interactive step is to prompt me to report my status (either via a pre-filled Slack command instruction or the web form).
    *   **AC2:** Upon completing this step, I see a confirmation explaining how this update will be shared with my team.

**Epic 6: Basic Confidence Scoring & Provenance**
*   **User Story 6.1:** As the system, I want to assign a default `confidence_score` of 100% to all manually reported events.
    *   **AC1:** Every `ManualEvent` node created in the graph has a `confidence: 1.0` property.
    *   **AC2:** This score is displayed on the event card in the web UI.
*   **User Story 6.2:** As a user, I want to see the source of any information in the system.
    *   **AC1:** Every event card in the activity feed displays a `Source` icon and label (e.g., `Slack Manual Report`, `GitHub`).

## **Prioritized Backlog**

**Theme: MVP (v0.5) - "The Human-in-the-Loop Coordination Layer"**
*   **Must Haves:**
    1.  Epic 1: All Stories (Foundation)
    2.  Epic 2: User Stories 2.1, 2.2, 2.3 (Manual Event Hub)
    3.  Epic 4: User Stories 4.1, 4.2 (Universal Feed & Project View)
    4.  Epic 5: User Stories 5.1, 5.2 (Role-Based Onboarding)
    5.  Epic 6: User Story 6.2 (Provenance UI)
*   **Should Haves:**
    1.  Epic 3: User Stories 3.1, 3.2 (GitHub Integration - extends value but isn't the *first* step)
    2.  Epic 6: User Story 6.1 (Confidence Scoring backend)
*   **Could Haves:**
    1.  Epic 7: Admin Guardrails (defer until after initial user feedback)

## **Suggested Sprint 1 Backlog (2-Week Cycle)**

**Sprint Goal:** Enable a new user to sign up, create a project, and successfully report their status manually via the web UI, seeing their update in the activity feed.

This sprint focuses on the new core paradigm: manual-first, human-in-the-loop status reporting. The "working software" is a functional web app centered around human communication, laying the foundation for later automation.

1.  **User Story 1.1:** Sign up with GitHub OAuth.
    *   **Tasks:** Implement OAuth flow with GitHub; Create user model in PostgreSQL; Handle session management. (Frontend & Backend)
2.  **User Story 1.2:** Create a new Project.
    *   **Tasks:** Create project model and API endpoints; Build project creation UI in SvelteKit; Link project to user. (Backend & Frontend)
3.  **User Story 2.2:** Report status via the Web UI.
    *   **Tasks:** Build the "+ Report Status" button and modal component; Create API endpoint to receive manual events; Build the `TagInput` component with project tag suggestion. (Frontend & Backend)
4.  **User Story 2.3:** Store manual events with provenance.
    *   **Tasks:** Define the `ManualEvent` node schema in Neo4j; Create processor consumer for manual events from Kafka; Write event to Neo4j and link to Project/User. (Backend)
5.  **User Story 4.1:** Universal Activity Feed.
    *   **Tasks:** Create GraphQL query to fetch mixed event types; Build the `EventCard` component with `manual` variant; Build the filter bar for source and project. (Frontend & Backend)
6.  **User Story 5.1 & 5.2:** Role-based onboarding that prompts manual report.
    *   **Tasks:** Add `role` field to user model; Build onboarding wizard UI steps; Integrate the "Report Status" modal into the onboarding flow. (Frontend & Backend)
7.  **Infrastructure:**
    *   **Task:** Set up foundational SvelteKit app with routing and state management.
    *   **Task:** Set up Neo4j and define initial schema.
    *   **Task:** Set up Kafka for event processing.

**Sprint 1 Outcome:** A user can sign up, tell the system they are a "Designer," create a "#login-redesign" project, use the web form to report "Started working on wireframes," and immediately see their update in the personal activity feed. This validates the new, broader vision immediately.

## **Sprint 0 Plan (Pre-Development)**

**Objective:** Finalize technical setup and design specifications to ensure Sprint 1 can begin efficiently.

**Technical Tasks:**
1.  Finalize and provision the development environment (Kubernetes cluster, Neo4j, Kafka, PostgreSQL instances).
2.  Establish the base SvelteKit project structure and CI/CD pipeline.
3.  Create detailed API specifications for the endpoints needed in Sprint 1 (Auth, Projects, Manual Events).
4.  Finalize the Neo4j graph schema for Manual Events, Users, and Projects.

**Design Tasks:**
1.  Deliver high-fidelity mockups for all Sprint 1 UI components:
    *   Onboarding flow with role selection
    *   Dashboard with activity feed and filters
    *   Project creation form
    *   Manual Event reporting modal
    *   Event Card components (Manual variant)
2.  Finalize the design system components in Storybook (MUI base, custom `TagInput`, `EventCard`).

**Stakeholder Alignment:**
1.  Review the Sprint 1 goal and backlog with leadership to confirm alignment with the new strategic direction.
2.  Present the Sprint 0 design mockups to a group of beta users (especially Designers/PMs) for early feedback on the manual reporting flow.