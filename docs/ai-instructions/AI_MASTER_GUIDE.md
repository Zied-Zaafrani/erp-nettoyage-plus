# AI Master Guide - Nettoyage Plus Project

## START HERE - Read This First Time we start a conversation

**Current Session Context**
- Current User: ZiedZaafrani
- Date: 12/26/2025

---

## Step 0: Understand the Project Context

**MANDATORY BEFORE ANYTHING ELSE:**

Read the project overview to understand what we're building, this is a markdown that lists features in business priority:
- **File:** `/docs/about-project/PROJECT_SUMMARY.md` (file should never be updated)

Read the company operational plan to understand how the company works that we are coding the app for:
- **File:** `/docs/about-project/COMPANY_OPERATIONS.md` (file should never be updated)

Read the database structure :
- **File:** `/docs/about-project/DATABASE_SCHEMA.md` (always under updates)

Read the user roles of this app :
- **File:** `/docs/about-project/USER_ROLES.md` (always under updates)

Read the tech that we are gonna usec for this project :
- **File:** `/docs/about-project/TECH_STACK.md` (always under updates)

**Without this context, you're coding blind.**

---

## Step 1: Identify User & Load Preferences

**MANDATORY FIRST ACTION**: 
1. Identify current user from session context
2. Read: `/docs/ai-instructions/user-preferences/[Username]_Preferences.md`
3. Adapt your communication style, language, and detail level to match user preferences

**Team Roster:**
- **Zied Zaafrani** - Backend Developer (NestJS, PostgreSQL, TypeScript)
- **Montassar Lemjid** - Frontend Developer (React, React Native, TailwindCSS)

---

## Step 2: Load Domain-Specific Rules

### If User is Zied (Backend Work)
**Primary Reference:** `/docs/ai-instructions/backend/AI_CODING_RULES_BACKEND.md`

**Supporting Documents:**
- `/docs/ai-instructions/backend/ERROR_LOG_BACKEND.md` - Known issues and solutions only for the backend
- `/docs/ai-instructions/backend/QUESTIONS_BACKEND.md` - Open questions by the AI, answered by Zied Zaafrani only for the backend
- `/docs/ai-instructions/backend/FUTURE_IMPROVEMENTS_BACKEND.md` - Improvement suggested by the AI only for the backend
- `/docs/ai-instructions/backend/TASK_LOG_BACKEND.md` - Log of all tasks done throughout this project only for the backend


### If User is Montassar (Frontend Web Work)
**Primary Reference:** `/docs/ai-instructions/frontend/web-app/AI_CODING_RULES_WEB.md`

**Supporting Documents:**
- `/docs/ai-instructions/frontend/web-app/ERROR_LOG_WEB.md`
- `/docs/ai-instructions/frontend/web-app/QUESTIONS_WEB.md`
- `/docs/ai-instructions/frontend/web-app/FUTURE_IMPROVEMENTS_WEB.md`
- `/docs/ai-instructions/frontend/web-app/TASK_LOG_WEB.md`

### If User is Montassar (Frontend Mobile Work)
**Primary Reference:** `/docs/ai-instructions/frontend/mobile-app/AI_CODING_RULES_MOBILE.md`

**Supporting Documents:**
- `/docs/ai-instructions/frontend/mobile-app/ERROR_LOG_MOBILE.md`
- `/docs/ai-instructions/frontend/mobile-app/QUESTIONS_MOBILE.md`
- `/docs/ai-instructions/frontend/web-app/FUTURE_IMPROVEMENTS_MOBILE.md`
- `/docs/ai-instructions/frontend/web-app/TASK_LOG_MOBILE.md`

---

## Step 3: Universal Principles (Apply to ALL Work)

### The Golden Rule: **Ask Before Acting**

**Never do these without explicit user permission:**
- Save to Git / Commit / Push
- Delete files or code
- Refactor existing working code
- Install new dependencies
- Change project configuration
- Try more than 2 error fix attempts without asking

**Always do these:**
- Read user preferences first
- Ask clarifying questions if instructions unclear
- State implementation plan and wait for confirmation
- Test code before responding
- Log completed work
- Stop and ask after 2 failed attempts

---

## Step 4: Standard Workflow

### For Every Task, Follow This Sequence:

**1. Understanding Phase**
- Read the task carefully
- Check domain-specific QUESTIONS file for any pending answers
  - `/docs/ai-instructions/backend/QUESTIONS_BACKEND.md` (if backend)
  - `/docs/ai-instructions/frontend/web-app/QUESTIONS_WEB.md` (if web)
  - `/docs/ai-instructions/frontend/mobile-app/QUESTIONS_MOBILE.md` (if mobile)
- Ask yourself: "Are instructions 100% clear?"
- If NO → Add questions to appropriate QUESTIONS file → **STOP and wait**
  - `/docs/ai-instructions/backend/QUESTIONS_BACKEND.md` (if backend)
  - `/docs/ai-instructions/frontend/web-app/QUESTIONS_WEB.md` (if web)
  - `/docs/ai-instructions/frontend/mobile-app/QUESTIONS_MOBILE.md` (if mobile)
- If YES → Continue to planning

**2. Planning Phase**
- State clearly what you will do:
  - Which files will be created/modified
  - What approach you'll use
  - Estimated complexity (Small/Medium/Large)
- Wait for user confirmation
- If user says "proceed" or "go ahead" or "ok" → Continue
- If user wants changes → Adjust plan, confirm again

**3. Execution Phase**
- Write the code following domain-specific rules
- Test as you go
- Keep code modular and reusable

**4. Verification Phase**
- Run the code
- Check for errors/warnings
- If errors found (see step 6):
  - **Attempt 1:** Try to fix
  - **Attempt 2:** Try alternative approach
  - **After 2 failures:** Log in appropriate ERROR_LOG file, ask user:
        - `/docs/ai-instructions/backend/ERROR_LOG_BACKEND.md` (if backend)
        - `/docs/ai-instructions/frontend/web-app/ERROR_LOG_WEB.md` (if web)
        - `/docs/ai-instructions/frontend/mobile-app/ERROR_LOG_MOBILE.md` (if mobile)
    - "I've tried 2 approaches and encountered errors. Should I:
      - A) Try [suggest specific next approach]
      - B) Stop and review the errors together
      - C) Try a completely different solution"
  - **Wait for user choice** - do NOT continue automatically

**5. Completion Phase**
- Update the task log of with what was done in its appropriate TASK_LOG file (see step 7)
  - `/docs/ai-instructions/backend/TASK_LOG_BACKEND.md` (if backend)
  - `/docs/ai-instructions/frontend/web-app/TASK_LOG_WEB.md` (if web)
  - `/docs/ai-instructions/frontend/mobile-app/TASK_LOG_MOBILE.md` (if mobile)
- If limitations/future improvements identified → Update in the appropriate FUTURE_IMPROVEMENTS file
  - `/docs/ai-instructions/backend/FUTURE_IMPROVEMENTS_BACKEND.md` (if backend)
  - `/docs/ai-instructions/frontend/web-app/FUTURE_IMPROVEMENTS_WEB.md` (if web)
  - `/docs/ai-instructions/frontend/mobile-app/FUTURE_IMPROVEMENTS_MOBILE.md` (if mobile)
- Report completion to user

---

## Step 5: Git Operations Protocol

**Git commands are NEVER automatic. Execute ONLY when user explicitly says:**
- "Save this" / "Commit this" / "Push to Git"
- "Create a branch"
- "Roll back to [commit]"
- "Merge [branch]"

**When user requests Git operation:**
1. Read: `/docs/ai-instructions/shared/GIT_INSTRUCTIONS.md`
2. Follow instructions exactly
3. Confirm action with user before executing
4. Report results after completion

**IF NO INSTRUCTIONS OF WHAT WAS ASKED** comfirm simply to the user on what it should do

---

## Step 6: Error Handling Protocol

### When Errors Occur

**First Error:**
- Attempt fix using best judgment
- If fixed → Continue
- If not fixed → Try alternative approach

**Second Error:**
- **STOP immediately**
- Log full error context in appropriate ERROR_LOG:
  - `/docs/ai-instructions/backend/ERROR_LOG_BACKEND.md` (if backend)
  - `/docs/ai-instructions/frontend/web-app/ERROR_LOG_WEB.md` (if web)
  - `/docs/ai-instructions/frontend/mobile-app/ERROR_LOG_MOBILE.md` (if mobile)
- Format:
```
  ## [Date] - [Feature Name] - User: [Username]
  **Error:** [Brief description]
  **Full Error Log:** [Stack trace]
  **Attempts Made:**
  1. [First attempt and result]
  2. [Second attempt and result]
  **Need Decision:** [Ask user for next steps]
```
- Present to user and **wait for guidance**

### Never Do:
- Keep trying random fixes hoping something works
- Hide errors or failed attempts
- Assume user wants you to keep going

---

## Step 7: Documentation & Logging

### Task Logging (After Every Completed Task)
Update respective TASK_LOG file:
  - `/docs/ai-instructions/backend/TASK_LOG_BACKEND.md` (if backend)
  - `/docs/ai-instructions/frontend/web-app/TASK_LOG_WEB.md` (if web)
  - `/docs/ai-instructions/frontend/mobile-app/TASK_LOG_MOBILE.md` (if mobile)
```
## [YYYY-MM-DD HH:MM] - [Task Type] - [Feature Name]
**User:** [Zied / Montassar]
**Scope:** [Small / Medium / Large]

**What Was Done:**
- Action 1
- Action 2
...
- Action N

**Files Modified:** [List paths]
**Files Created:** [List paths]
**Testing:** [What was tested and results]
**Notes:** [Any important context]
```

### Future Improvements (When Applicable)
Update respective FUTURE_IMPROVEMENTS file:
  - `/docs/ai-instructions/backend/FUTURE_IMPROVEMENTS_BACKEND.md` (if backend)
  - `/docs/ai-instructions/frontend/web-app/FUTURE_IMPROVEMENTS_WEB.md` (if web)
  - `/docs/ai-instructions/frontend/mobile-app/FUTURE_IMPROVEMENTS_MOBILE.md` (if mobile)
```
## [Date] - [Feature Name]
**Current State:** [What exists now]
**Limitations:** [What could be better]
**Proposed Improvements:**
- Security: [Enhancement ideas]
- UX: [User experience improvements]
- Performance: [Optimization opportunities]
- Modularity: [Reusability improvements]

**Priority:** [Low / Medium / High]
**Effort:** [Small / Medium / Large]
```

---

## Quick Decision Tree
```
User sends task
    ↓
Load user preferences → Load domain rules
    ↓
Instructions clear?
    ↓ NO → Add to QUESTIONS → STOP
    ↓ YES
Check for edge cases/loopholes?
    ↓ YES → Add to QUESTIONS → STOP
    ↓ NO
State implementation plan
    ↓
Wait for user confirmation
    ↓ User confirms
Write code
    ↓
Test code
    ↓
Errors? 
    ↓ YES → Fix attempt 1
    ↓ Still errors? 
    ↓ YES → Fix attempt 2
    ↓ Still errors?
    ↓ YES → Log to ERROR_LOG → Ask user → STOP
    ↓ NO
Update TASK_LOG
    ↓
Update FUTURE_IMPROVEMENTS (if applicable)
    ↓
Report completion
```

---

## AI Self-Check (Before Every Task Completion)

Ask yourself:
- [ ] Did I load user preferences?
- [ ] Did I load correct domain rules?
- [ ] Are instructions 100% clear or do I need to ask questions?
- [ ] Did I get user confirmation before implementing?
- [ ] Did I test the code?
- [ ] Am I about to do Git operations without being asked? (If yes, STOP)
- [ ] Have I tried fixing an error more than twice? (If yes, ask user)
- [ ] Did I log my completed work?

---

## Emergency Protocol

**If You're Completely Stuck:**
1. Document everything in appropriate ERROR_LOG
2. Tag urgency: [LOW / MEDIUM / HIGH / CRITICAL]
3. Alert user immediately with clear summary
4. Suggest: "Should we review this together?" or "Should we try a different approach?"

**Never:**
- Panic and make random changes
- Hide the problem
- Keep going without guidance

---

## File Locations Quick Reference

**Universal Files:**
- Master Guide: `/docs/ai-instructions/AI_MASTER_GUIDE.md` (this file)
- Project Overview: `/docs/about-project/PROJECT_SUMMARY.md`
- Tech Stach Globally: `/docs/about-project/TECH_STACK.md`
- Database Structure: `/docs/about-project/DATABASE_SCHEMA.md`
- User Roles: `/docs/about-project/USER_ROLES.md`

**Backend:**
- Rules: `/docs/ai-instructions/backend/AI_CODING_RULES_BACKEND.md`
- Errors: `/docs/ai-instructions/backend/ERROR_LOG_BACKEND.md`
- Questions: `/docs/ai-instructions/backend/QUESTIONS_BACKEND.md`
- Future Improvements: `/docs/ai-instructions/backend/FUTURE_IMPROVEMENTS_BACKEND.md`
- Task Log: `/docs/ai-instructions/backend/TASK_LOG_BACKEND.md`

**Frontend Web:**
- Rules: `/docs/ai-instructions/frontend/web-app/AI_CODING_RULES_WEB.md`
- Errors: `/docs/ai-instructions/frontend/web-app/ERROR_LOG_WEB.md`
- Questions: `/docs/ai-instructions/frontend/web-app/QUESTIONS_WEB.md`
- Future Improvements: `/docs/ai-instructions/frontend/web-app/FUTURE_IMPROVEMENTS_WEB.md`
- Task Log: `/docs/ai-instructions/frontend/web-app/TASK_LOG_WEB.md`

**Frontend Mobile:**
- Rules: `/docs/ai-instructions/frontend/mobile-app/AI_CODING_RULES_MOBILE.md`
- Errors: `/docs/ai-instructions/frontend/mobile-app/ERROR_LOG_MOBILE.md`
- Questions: `/docs/ai-instructions/frontend/mobile-app/QUESTIONS_MOBILE.md`
- Future Improvements: `/docs/ai-instructions/frontend/mobile-app/FUTURE_IMPROVEMENTS_MOBILE.md`
- Task Log: `/docs/ai-instructions/frontend/mobile-app/TASK_LOG_MOBILE.md`

**Shared:**
- Git: `/docs/ai-instructions/shared/GIT_INSTRUCTIONS.md`

---

**Version:** 4.0  
**Last Updated:** December 26, 2025  
**Maintained By:** Zied Zaafrani & Montassar Lemjid

---

**Remember:** You are a collaborative assistant, not an autonomous agent. Always communicate, always ask, always confirm.