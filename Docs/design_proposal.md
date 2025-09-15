**UX/UI Design Plan: FlowSync AI (v1.3)**

**1. User Flows**

The enhanced PRD positions FlowSync as a cross-functional coordination hub. The user flows must reflect this shift from a purely engineering-focused tool to an ecosystem-wide nervous system.

*   **Flow 1: Initial Onboarding & First Manual Report (Primary User: All)**
    1.  **Sign-Up:** User authenticates via OAuth.
    2.  **Role Selection:** A new screen asks "What best describes your role?" with options like Engineer, Designer, Product Manager, Marketing, etc. This choice tailors the subsequent onboarding.
    3.  **Core Value Demo:** Instead of just connecting a repo first, the onboarding wizard introduces the **Manual Event Hub**. For a non-engineer (e.g., a Designer), the first step is: "Tell your team what you're working on. Try it now." It prompts the user to send a test Slack command (`/flowsync designing new login screen`) or use a simple in-app input.
    4.  **Connect Tools:** The wizard then suggests connecting relevant tools based on their role (e.g., "Connect Figma to automate status updates from your design files" for a Designer, or "Connect your repo" for an Engineer).
    5.  **Activation:** The primary activation metric is now broader. Goal is achieved when the user either *receives* a digest or *successfully reports* a manual status update.

*   **Flow 2: Manual Status Reporting via Slack (Primary User: Designer, PM, Content)**
    1.  **Initiation:** A Designer completes a milestone in Figma. They switch to their team's Slack channel.
    2.  **Command:** They type `/flowsync [message]`, e.g., `/flowsync Completed mockups for new checkout flow. Ready for dev handoff. #checkout-redesign`.
    3.  **Confirmation:** The FlowSync bot immediately replies in a thread with a confirmation: "✅ Status updated. I've linked this to the `#checkout-redesign` epic." This provides immediate, low-friction feedback that the system is working.

*   **Flow 3: Cross-Functional Status Query (Primary User: Product Manager)**
    1.  **Initiation:** A PM wants a holistic view of a feature's launch readiness. They open the web dashboard.
    2.  **Query:** They use the chatbot: "What's the launch status for the 'checkout redesign'? Include design, dev, and content."
    3.  **Processing & Response:** The chatbot returns a unified summary, pulling data from multiple subgraphs:
        *   "**Design:** ✅ Complete (Source: Manual report from Sarah, Figma file)"
        *   "**Engineering:** ⚠️ In Progress, PR #224 awaiting review (Source: GitHub)"
        *   "**Content:** ❓ No status yet. I've asked the content team for an update." (This last point is a key new behavior – proactive nudging based on missing data).
    4.  **Action:** The PM can see the entire picture and can directly click to review the PR or message the content lead.

**2. Screen Concepts & Wireframe Descriptions**

*   **Screen A: Universal Dashboard / Home Feed**
    *   **Layout:** Prioritizes a feed-like structure (similar to LinkedIn or Twitter) to accommodate the diverse, cross-functional input types. Left-hand navigation remains for teams/projects. Right column for alerts and health.
    *   **Main Content Area - "Activity Feed":**
        *   **Cards:** Each card represents an event. The card's visual design differs based on the event source (Automated vs. Manual).
        *   **Manual Event Card:** Has a distinctive border color (e.g., blue). Shows the user's avatar, the reported message, timestamp, and any manually added `#tags`. Includes a "Comment" button for teammates to ask questions.
        *   **Automated Event Card:** Standard border. Shows the system icon (e.g., GitHub logo), a concise automated message ("PR #224 was merged"), and a "View Details" link.
        *   **Filter Bar:** Above the feed, users can filter by source (All, Manual, GitHub, Jira, Figma), team, or project tag.
    *   **Primary Action Button:** A prominent "+ Report Status" button, anchoring the screen and emphasizing the new human-in-the-loop model.

*   **Screen B: Manual Event Reporter**
    *   **Layout:** A clean, focused modal window triggered by the "+ Report Status" button.
    *   **Input Field:** A large, inviting text area with placeholder text: "What did you just complete? What are you working on next? E.g., 'Finished the blog post draft for the Q4 launch'"
    *   **Project/Tag Suggester:** As the user types, it suggests existing project tags (e.g., `#q4-launch`) based on content, allowing for easy categorization and linking to existing work.
    *   **Actions:** Buttons for "Submit" and "Cancel". Submission is quick and simple, respecting the user's time.

*   **Screen C: Project Status View (Replaces simple Digest View)**
    *   **Layout:** A dedicated page for tracking a project/epic/feature across functions.
    *   **Header:** Project name, description, and overall health indicator (a composite score).
    *   **Functional Sections:** Tabs or sections for **Engineering, Design, Content, Marketing**.
    *   **Per-Section View:** Each section shows:
        *   **Latest Status:** The most recent automated or manual update for that function.
        *   **Confidence Indicator:** The system's confidence in the overall state.
        *   **Key Links:** Direct links to the relevant PRs, Figma files, Google Docs, etc.
    *   **This screen is the ultimate expression of the "coordination layer" vision, breaking down silos on a single page.**

*   **Screen D: Admin Guardrails Page (Primary Persona: Team Lead/Admin)**
    *   **Layout:** A form-like settings page.
    *   **Automation Rules:** Toggle switches and dropdowns for configuring automation levels (e.g., "Automatically move Jira tickets to 'Done' on Merge: [Never, High-Confidence Only, Always]").
    *   **Confidence Thresholds:** Sliders for setting the minimum confidence required for different types of automated actions (e.g., "Notify channel of blocker: >65% confidence").
    *   **This UI makes the "human-in-the-loop" model tangible and configurable.**

**3. Design System Components**

*   **Foundation:** **Material UI (MUI)** remains the base for efficiency.
*   **New Custom Components:**
    *   **`EventCard`:** A reusable card component with a `variant` prop (`auto | manual`). The `manual` variant includes an avatar space and a comment affordance.
    *   **`StatusPill`:** Extends the `ConfidencePill` to include pure statuses from manual reports (e.g., "Completed", "Blocked", "In Review").
    *   **`SourceIcon`:** A small, consistent icon component used to denote the origin of information (GitHub, Figma, Slack Manual Report, Web Manual Report).
    *   **`TagInput`:** A styled input field for adding and suggesting project `#tags`, similar to Twitter's compose box.
*   **Data Display:** The MUI `Tabs` component will be crucial for the Project Status View to switch between functional areas.

**4. UX Notes & Concerns**

1.  **Designing for Diverse Literacy:** The UI must be equally intuitive for a non-technical content writer and a technical engineer. This means avoiding jargon, using clear and consistent labels, and providing helpful tooltips. The "Report Status" modal is the most important interface for non-engineers and must be dead simple.
2.  **Avoiding Feed Overload:** The universal activity feed is powerful but could become noisy. The filtering and tagging system must be robust and intuitive from the start. Consider "smart" feeds that learn to prioritize relevant events for the user.
3.  **Proactive Nudging UX:** The system's ability to identify missing data (e.g., "No status yet from content") is a killer feature, but the UX must be helpful, not nagging. The phrasing and timing of these nudges need careful design and user testing.
4.  **Cross-Functional Trust:** A designer needs to trust that the automated data from engineering is accurate, and vice versa. The UI must build this cross-functional trust by being relentlessly transparent. Showing the **source** of every piece of information (via the `SourceIcon`) is non-negotiable.
5.  **Configurability vs. Simplicity:** The Admin Guardrails page introduces necessary complexity for trust and control. We must design it to feel powerful for admins without overwhelming them. Good defaults, clear explanations, and a stepped configuration process (Basic/Advanced) will be key.
6.  **The Manual Event as a First-Class Citizen:** The visual design must consistently elevate manual reports to the same level of importance as automated signals. This is core to the revised product philosophy and must be reflected in the hierarchy, spacing, and treatment of `EventCard` components.