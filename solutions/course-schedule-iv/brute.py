class Solution:
    def checkIfPrerequisite(self, numCourses: int, prerequisites: List[List[int]], queries: List[List[int]]) -> List[bool]:
        adj = [[] for _ in range(numCourses)]
        for a, b in prerequisites:
            adj[a].append(b)

        def reach(u, target, seen):
            if u == target:
                return True
            seen.add(u)
            return any(w not in seen and reach(w, target, seen) for w in adj[u])

        return [reach(u, v, set()) for u, v in queries]     # a fresh search per query
