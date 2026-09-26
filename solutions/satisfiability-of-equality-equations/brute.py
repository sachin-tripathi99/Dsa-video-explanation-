class Solution:
    def equationsPossible(self, equations: List[str]) -> bool:
        adj = [[] for _ in range(26)]
        for e in equations:
            if e[1] == "=":
                x, y = ord(e[0]) - 97, ord(e[3]) - 97
                adj[x].append(y)
                adj[y].append(x)

        def reaches(a, b):
            seen = {a}
            q = deque([a])
            while q:
                u = q.popleft()
                if u == b:
                    return True
                for w in adj[u]:
                    if w not in seen:
                        seen.add(w)
                        q.append(w)
            return False

        for e in equations:
            if e[1] == "!" and reaches(ord(e[0]) - 97, ord(e[3]) - 97):
                return False
        return True
