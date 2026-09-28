from collections import deque

class Solution:
    def checkIfPrerequisite(self, numCourses: int, prerequisites: List[List[int]], queries: List[List[int]]) -> List[bool]:
        n = numCourses
        adj = [[] for _ in range(n)]
        indeg = [0] * n
        for a, b in prerequisites:
            adj[a].append(b)
            indeg[b] += 1
        before = [set() for _ in range(n)]     # before[v]: every course that comes before v
        q = deque(i for i in range(n) if indeg[i] == 0)
        while q:
            u = q.popleft()
            for w in adj[u]:
                before[w] |= before[u]          # hand down u's set, plus u
                before[w].add(u)
                indeg[w] -= 1
                if indeg[w] == 0:
                    q.append(w)
        return [u in before[v] for u, v in queries]
