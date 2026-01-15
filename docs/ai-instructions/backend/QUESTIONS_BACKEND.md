# Backend Questions

Questions from AI that need Zied's decision before proceeding.

---

## Open Questions



## Answered Questions

Zied answer to the questions..

---

### Q1: Default User Role on Registration
**Date:** January 1, 2026
**Context:** Auth module - register endpoint  
**Question:** Currently, new users default to `AGENT` role. Should registration:
- A) Always default to AGENT (current behavior)

---

### Q2: Email Verification Requirement
**Date:** January 1, 2026  
**Context:** Auth module - register endpoint  
**Question:** Should email verification be required before users can login?
- A) No - users can login immediately for now, but add the option if later we have to make email auth verification on login/signup

---

### Q3: Password Policy
**Date:** January 1, 2026  
**Context:** Auth module - register DTO  
**Question:** Current password requirement is minimum 8 characters. Should we enforce:
- A) Just minimum length and let it be 18 characters not 8.

---

### Q4: Should Clients be Linked to User Accounts?
**Date:** January 15, 2026  
**Context:** Clients module - client entity  
**Question:** Looking at USER_ROLES.md, there's a CLIENT role for users. Should clients be linked to a user account (for client portal login)?
- A) Yes - Add `userId` FK to link client with their login account

---

### Q5: Client Code / Reference Number?
**Date:** January 15, 2026  
**Context:** Clients module - client entity  
**Question:** For invoicing and references, do clients need a human-readable code like `CLI-0001`?
- A) Yes - Add auto-generated `clientCode` field

---

### Q6: Site Ownership Transfer
**Date:** January 15, 2026  
**Context:** Sites module - UpdateSiteDto excludes clientId  
**Question:** The UpdateSiteDto explicitly excludes clientId with the comment "site ownership shouldn't change". Is this a hard business rule?
- B) Add separate transfer endpoint with validation

**Implementation Note:** Will add dedicated `POST /sites/:id/transfer` endpoint with audit logging in future phase.

---

### Q7: Cascade Delete on Client → Sites
**Date:** January 15, 2026  
**Context:** Site entity has onDelete: 'CASCADE'  
**Question:** When a client is deleted, ALL their sites are permanently deleted. Is this intended?
- C) Rely on soft deletes (current) + prevent client deletion if sites exist

**Implementation Note:** Add validation in ClientsService.remove() to check for existing sites before allowing deletion.

---

### Q8: Client Email Uniqueness with NULL Values
**Date:** January 15, 2026  
**Context:** Client entity - email field is unique and nullable  
**Question:** Email is unique: true and nullable: true. How should this behave?
- **Answer:** Email is required for validation of the account. The user can still browse and look, but if they want to request anything they need email verified.

**Implementation Note:** Email verification flow will enforce this - clients without verified email can only view, not request services.

---

### Q9: Client Code Concurrency
**Date:** January 15, 2026  
**Context:** generateClientCode() in ClientsService  
**Question:** Two simultaneous client creations could generate duplicate codes. How to handle?
- **Answer:** Use industry-standard approach - database sequence is safest.

**Implementation Note:** Migrate from findOne + increment pattern to PostgreSQL sequence in future phase to eliminate race conditions.

---

