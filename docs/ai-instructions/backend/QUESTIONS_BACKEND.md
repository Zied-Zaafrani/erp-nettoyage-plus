# Backend Questions

Questions from AI that need Zied's decision before proceeding.

---

## Open Questions

### Q1: Default User Role on Registration
**Date:** December 27, 2025  
**Context:** Auth module - register endpoint  
**Question:** Currently, new users default to `AGENT` role. Should registration:
- A) Always default to AGENT (current behavior)
- B) Require role to be specified (admin creates users with roles)
- C) Have a separate public registration (always CLIENT) vs admin-created users (any role)

**Status:** ⏳ Awaiting answer

---

### Q2: Email Verification Requirement
**Date:** December 27, 2025  
**Context:** Auth module - register endpoint  
**Question:** Should email verification be required before users can login?
- A) No - users can login immediately (current)
- B) Yes - must verify email first (need email service setup)
- C) Configurable per user type (e.g., clients must verify, employees don't)

**Status:** ⏳ Awaiting answer

---

### Q3: Password Policy
**Date:** December 27, 2025  
**Context:** Auth module - register DTO  
**Question:** Current password requirement is minimum 8 characters. Should we enforce:
- A) Just minimum length (current)
- B) Complexity rules (uppercase, lowercase, number, special char)
- C) Configurable per environment (relaxed for dev, strict for prod)

**Status:** ⏳ Awaiting answer

---

## Answered Questions

(None yet)

---
