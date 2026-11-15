// POST /posts always answers id 101, so created posts get decrementing
// negative IDs instead (PLAN decision 2): still numbers, never clash with
// server IDs, deterministic in tests.
let nextId = -1

export function nextLocalPostId() {
  return nextId--
}
