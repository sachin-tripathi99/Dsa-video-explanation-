from collections import deque

class Solution:
    def findMinHeightTrees(self, n: int, edges: List[List[int]]) -> List[int]:
        adj = [[] for _ in range(n)]
        for a, b in edges:
            adj[a].append(b)
            adj[b].append(a)

        def height(r):                          # one BFS per possible root
            d = [-1] * n
            d[r] = 0
            q = deque([r])
            while q:
                x = q.popleft()
                for w in adj[x]:
                    if d[w] < 0:
                        d[w] = d[x] + 1
                        q.append(w)
            return max(d)

        h = [height(r) for r in range(n)]
        best = min(h)
        return [r for r in range(n) if h[r] == best]
