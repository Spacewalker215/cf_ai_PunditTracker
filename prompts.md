# User Prompts - PunditTracker Development Session

This document contains all user prompts/requests made during the development session.

---
## Main prompt

A web app that tracks the specific predictions of financial analysts, sports commentators, or tech pundits and grades their accuracy over time.

---
## 1. Initial Request: Admin Dashboard Fixes
**Context**: Main objective to fix bugs in the Admin Dashboard

**Request**:
- Fix issue where pending predictions are not loading
- Ensure AI grading functionality works correctly
- Ensure manual grading functionality works correctly
- Thoroughly test the application after recent code changes

---

## 2. AI Error & UI Polish Request
**Date**: 2025-11-21 01:32:48

**Request**:
```
You haven't tested everything cause when I tried the ai it gave me an error 
"forward-logs-shared.ts:95 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
forward-logs-shared.ts:95 [HMR] connected
intercept-console-error.ts:42 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. [...]
api/grade:1  Failed to load resource: the server responded with a status of 500 (Internal Server Error)"

and it said no response from the ai, please make sure the UI looks alot better
```

**Issues Identified**:
- Hydration mismatch errors in React
- AI grading API returning 500 errors
- Request to improve UI aesthetics