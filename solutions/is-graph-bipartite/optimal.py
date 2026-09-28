from collections import deque

class Solution:
    def isBipartite(self, graph: List[List[int]]) -> bool:
        col = [-1] * len(graph)
        for s in range(len(graph)):             # every component
            if col[s] != -1:
                continue
            col[s] = 0
            q = deque([s])
            while q:
                x = q.popleft()
                for y in graph[x]:
                    if col[y] == -1:
                        col[y] = 1 - col[x]     # forced colour
                        q.append(y)
                    elif col[y] == col[x]:
                        return False            # conflict
        return True
