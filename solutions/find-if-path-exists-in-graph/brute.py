class Solution:
    def validPath(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
        reached = [False] * n
        reached[source] = True
        changed = True
        while changed:                          # at most n sweeps
            changed = False
            for a, b in edges:
                if reached[a] != reached[b]:
                    reached[a] = reached[b] = True
                    changed = True
        return reached[destination]
