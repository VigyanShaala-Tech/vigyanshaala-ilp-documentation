---
hide:
  - navigation
---

# Glossary of Terms

<div class="skip-to admin-guide glossary-page"></div>

<p class="sr-search-terms">glossary of terms studio control hub instructor dashboard my dashboard lms cms course outline section subsection unit component library content collection problem bank enrollment cohort certificate template grading policy publish release date course team organization course number course run course id tas analytics rubric badge rule engine points attempts scoring show answer</p>

Key terms used in the Admin Guide.

## Where admins work

| Term | Meaning |
|------|---------|
| **My Dashboard** | The home screen after you log in. It lists courses for learning. From the account or name menu you can open Control Hub, Studio, and other admin tools. |
| **Control Hub** | The site administration area. Use it to manage users, course catalog settings, certificate designs, registration forms, notification rules, and badges. It does not build lesson pages — that is Studio. |
| **Studio** | The place where you **build and edit course content**: the course outline, units, text, videos, problems, and other blocks. Also called **CMS** in Control Hub NAVIGATION. |
| **CMS** | Same as **Studio** — the content management side where courses are built. |
| **LMS** | The learning site learners use (My Dashboard and course pages). Staff open the **Instructor dashboard** from inside a live course on the LMS. See also [How tools connect](admin-flow.md). |
| **Instructor dashboard** | Staff tools **inside one live course**: enroll people, manage the course team, grades, cohorts, certificates, data downloads, and related reports. |
| **TAS Admin panel** | A separate admin area (opened from Control Hub NAVIGATION) where you build assignment types, rubrics, and fillable templates used by Template Based Assignments in Studio. |
| **Analytics** | Charts and dashboards about enrollments, engagement, and performance. Opened from Control Hub NAVIGATION; Studio also has an analytics sidebar next to course content. |
| **Zulip** | Team chat opened from Control Hub NAVIGATION. |

## Course structure (how a course is built)

Think of a course like a book: **sections** are chapters, **subsections** are parts of a chapter, **units** are pages, and **components** are the blocks on each page.

| Term | Meaning |
|------|---------|
| **Course outline** | The full map of the course in Studio — every section, subsection, and unit in the order learners will see them. This is the table of contents you edit while building the course. |
| **Section** | The **top level** of the outline (a large chapter). Example: *Week 1* or *Module 1*. A section holds one or more subsections. You can set when a section is released to learners. |
| **Subsection** | A **part inside a section**. Example: *Lesson 1* under *Week 1*. Due dates, grading type, and timed or proctored exams are usually set on the subsection. A subsection holds one or more units. |
| **Unit** | A **single page** learners open. Inside a unit you add components such as text, video, problems, PDFs, Zoom, or assignments. |
| **Component** | One **content block on a unit**. Examples: Text, Video, Problem, Problem Bank, Library Content, Zoom Live Class, Staff Graded Assignment, Template Based Assignment. |
| **Problem** | A question or exercise on a unit that learners answer (multiple choice, numerical, and other types). Many problems can be graded automatically. |
| **Points** | How many marks one problem is worth. Set under **Scoring** in the problem editor (**Show advanced settings**). If empty, the problem is worth **1** point. |
| **Attempts** | How many times a learner may submit an answer for one problem. Tick **Unlimited attempts** to remove the limit. |
| **Text / HTML** | A component that shows written content on a unit (instructions, readings, images, links). |
| **Video** | A component that plays a video on a unit. You usually paste a video URL (for example YouTube) rather than uploading a large file into Studio. |
| **Publish** | Push your Studio edits so they can appear in the live learner course. Publishing alone is not enough if the content is still **unscheduled** or **hidden**. |
| **Release date** | The date and time when a section, subsection, or unit becomes available to learners (after it is published). Times follow **UTC** unless your site is configured otherwise. |
| **Unscheduled** | No release date is set. Learners will not see that content even if it is published. |
| **Hide from learners** | Hides content from learners even when it is published. Staff can still see it. |
| **Preview** | View your **unpublished** edits as staff, before learners see them. |
| **View live** | Open the **published** learner view of the course. |
| **Instructor-paced** | You control when sections and subsections open (release and due dates). |
| **Self-paced** | Learners move through the course on their own schedule, often with suggested dates. |
| **Enrollment start / Course start / Course end** | Separate dates: when people may enroll; when the course is open for learning; when the course closes. |
| **Organization / Course number / Course run** | The three pieces you set when creating a course in Studio. Together they form the course identity and appear in the course URL. |
| **Course ID** | The full course identifier shown in Control Hub. It is fixed after the course is created. |
| **UTC** | Coordinated Universal Time. Release dates, due dates, and many instructor extensions use UTC, not your local clock. |

## Reusable content in Studio

| Term | Meaning |
|------|---------|
| **Library** | A shared store of reusable course pieces (sections, subsections, units, or components) that you can use in more than one course. |
| **Content collection** | Another name for the same idea as a **Library** — reusable content kept in one place. Inside a library, a **collection** can also mean a folder that groups items. |
| **Problem Bank** | A set of problems kept together so you can reuse them or pull them into a unit. |
| **Library Content** | A component that embeds content from a library into a unit. |
| **Taxonomy / Course tags** | Tag lists in Studio used to label courses or content for search and filtering. |

## People, enrollment, and groups

| Term | Meaning |
|------|---------|
| **Enrollment** | Adding a person **into a course** (or removing them). After enrollment they can open the course (if their account is active and the course is available). |
| **Batch enrollment** | Enroll or unenroll many people at once using email addresses or usernames. |
| **Auto enroll** | If someone does not have an account yet, enroll them when they register or activate with that email. |
| **Account activated** | The user finished activation and can log in. Someone may be enrolled but still unable to use the course until activation is done. |
| **Enrollment track** | The enrollment type for a person in a course (for example Honor, Audit, Verified, or Professional), depending on what your site offers. |
| **Cohort** | A **group of learners inside one course** (for example Group A / Group B). Used for discussions, alternate content, or group management on the Instructor dashboard. |
| **Cohort Manage Form** | A **registration form** in Control Hub that people fill to join a linked course. This is **not** the same as an Instructor **cohort** group. |
| **Content group** | A Studio group linked to a course cohort so some units or components show only to certain learners. |
| **Course team** | People who help run **this course** (Staff, Limited Staff, Admin, and similar roles). This is separate from site-wide Control Hub roles. |
| **Site roles (Student / Mentor / Admin)** | Account roles in Control Hub User Management for the whole site — not the same as course team Staff/Admin. |
| **Beta tester** | Can see course content early (based on “days early” settings). Different from removing someone from the course. |
| **Block user** | Locks an account out of the LMS until an admin unblocks it. |

## Grades and certificates

| Term | Meaning |
|------|---------|
| **Grading policy** | The rules for scores in the course: which subsections count, how much each assignment type is worth, and what score is a pass. |
| **Grade as / Assignment type** | How a graded subsection is labeled (Homework, Exam, and so on) so the grading policy can weight it. |
| **Grade cutoff** | The pass line for the course (for example 0.5 means 50%). |
| **Progress page** | The learner’s own view of grades and completion. Staff can open a learner’s Progress page when needed. |
| **Gradebook** | A staff table of class scores on the Instructor dashboard. |
| **Student Admin** | Instructor tools to look up one learner and change problem scores, attempts, or related grade actions. |
| **Certificate template** | The **design** of a completion certificate in Control Hub (layout, logo, signatures). You assign a template to a course so finishers get that look. |
| **Signatory** | A name, title, organization, and signature image printed on a certificate (up to three). |
| **Certificates (Instructor)** | Instructor dashboard tools to manage issuing, exceptions, or invalidating certificates for learners in that course. |
| **Invalidate certificate** | Take back a certificate so it no longer opens for the learner. |

## Common Studio components and related tools

| Term | Meaning |
|------|---------|
| **Open Response (ORA)** | An open-ended written or file response. Scoring rules can differ from auto-graded problems. |
| **Staff Graded Assignment** | Learners upload a file; staff scores it (not auto-graded). |
| **Template Based Assignment (TAS)** | A unit block that uses a form and rubric built in the TAS Admin panel. |
| **Rubric** | A scoring guide (categories and criteria with marks) attached to a Template Based Assignment. |
| **Zoom Live Class** | An advanced component that schedules or embeds a Zoom session on a unit. |
| **Quick Quiz Maker** | An advanced component that loads many questions from an Excel (`.xlsx`) template. |
| **Import / Export** | Download or upload a full course content package (`.tar.gz`). This is content only — it does not include learner data or the course team list. |

## Control Hub catalog and forms

| Term | Meaning |
|------|---------|
| **Course Management** | Control Hub area for catalog metadata and per-course settings after the course exists in Studio. |
| **Category / Subject / Tag / Difficulty** | Labels you assign to courses in Control Hub for browsing and filtering. |
| **Ribbon text** | A short label shown on the course card. |
| **Registration link / Slug / QR** | The shareable URL for a Cohort Manage Form. The **slug** is the fixed last part of that URL; a **QR code** is that same URL as a scannable image. |
| **Master table** | A shared list of options used by dropdown, radio, or multi-select fields on registration forms (for example a list of states). |
| **In-progress registration** | The person passed eligibility or submitted the form but has not finished account activation yet. |

## Rules, badges, and notifications

| Term | Meaning |
|------|---------|
| **Rule Engine / Notification rule** | Defines when a message is sent, to whom, on which channel, and with which template. |
| **Event based / Schedule based** | Event based fires on an action (for example signup or enroll). Schedule based reminds people who stay in a state (for example never activated). |
| **Channel** | How a notification is delivered: Email, WhatsApp, Push, or SMS (as enabled on your site). |
| **Badge** | An award learners can earn. A **trigger** and **target count** define what action awards it and how many times or what score is required. |
| **Earned badges** | The read-only list of who already received which badge. |

**Where to work:**

- Build course content → **Studio**
- Manage users and site settings → **Control Hub**
- Help learners in a live course (enroll, grades) → **Instructor dashboard**
- Build assignment forms and rubrics → **TAS Admin panel**
- View charts and reports → **Analytics**
