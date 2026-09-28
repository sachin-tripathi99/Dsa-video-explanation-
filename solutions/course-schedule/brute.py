class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        adj = [[] for _ in range(numCourses)]
        for a, b in prerequisites:
            adj[b].append(a)

        def loops(u, on_path):
            if on_path[u]:
                return True                     # came back to the current path
            on_path[u] = True
            if any(loops(w, on_path) for w in adj[u]):
                return True
            on_path[u] = False
            return False

        # a fresh search from every course
        return not any(loops(s, [False] * numCourses) for s in range(numCourses))
