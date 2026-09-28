class Solution:
    def eventualSafeNodes(self, graph: List[List[int]]) -> List[int]:
        n = len(graph)

        def loops(u, on_path, clear):
            if on_path[u]:
                return True                     # back into the current path
            if clear[u]:
                return False                    # already explored in this search
            on_path[u] = True
            if any(loops(w, on_path, clear) for w in graph[u]):
                return True
            on_path[u] = False
            clear[u] = True
            return False

        # a fresh search from every node
        return [s for s in range(n) if not loops(s, [False] * n, [False] * n)]
