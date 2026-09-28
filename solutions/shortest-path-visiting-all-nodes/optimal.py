from collections import deque

class Solution:
    def shortestPathLength(self, graph: List[List[int]]) -> int:
        n = len(graph)
        full = (1 << n) - 1
        q = deque((i, 1 << i) for i in range(n))   # start anywhere
        seen = set(q)
        d = 0
        while q:
            for _ in range(len(q)):
                u, mask = q.popleft()
                if mask == full:
                    return d                    # everything visited
                for w in graph[u]:
                    state = (w, mask | 1 << w)
                    if state not in seen:
                        seen.add(state)
                        q.append(state)
            d += 1
        return -1
