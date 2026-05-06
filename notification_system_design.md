# Notification System Design

## Overview
This project is a React-based notification dashboard designed to display campus notifications with priority-based ranking, category filtering, and responsive UI support.

---

## Priority Logic

Notifications are prioritized based on category:

- Job / Placement → Highest Priority
- Academic / Results → Medium Priority
- Activity / Events → Lowest Priority

A priority map is used:

```js
const pMap = {
  job: 3,
  academic: 2,
  activity: 1
};