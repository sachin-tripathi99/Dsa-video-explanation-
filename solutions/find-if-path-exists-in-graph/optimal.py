class Solution:
    def validPath(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
        adj = [[] for _ in range(n)]
        for a, b in edges:
            adj[a].append(b)
            adj[b].append(a)

        seen = [False] * n
        seen[source] = True
        queue = deque([source])
        while queue:
            node = queue.popleft()
            if node == destination:
                return True
            for nb in adj[node]:
                if not seen[nb]:
                    seen[nb] = True             # mark on push
                    queue.append(nb)
        return False
