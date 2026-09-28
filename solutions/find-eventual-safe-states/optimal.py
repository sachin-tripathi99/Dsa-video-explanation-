from collections import deque

class Solution:
    def eventualSafeNodes(self, graph: List[List[int]]) -> List[int]:
        n = len(graph)
        rev = [[] for _ in range(n)]
        out = [len(o) for o in graph]
        for x, targets in enumerate(graph):
            for y in targets:
                rev[y].append(x)                # reversed arrows
        q = deque(x for x in range(n) if out[x] == 0)   # terminal = safe
        safe = [False] * n
        while q:
            y = q.popleft()
            safe[y] = True
            for x in rev[y]:
                out[x] -= 1
                if out[x] == 0:
                    q.append(x)
        return [x for x in range(n) if safe[x]]
