class Solution:
    def minRemoveToMakeValid(self, s: str) -> str:
        def valid(t):
            bal = 0
            for c in t:
                if c == "(":
                    bal += 1
                elif c == ")":
                    bal -= 1
                    if bal < 0:
                        return False
            return bal == 0

        level = {s}
        while True:                             # BFS by number of removals
            for t in level:
                if valid(t):
                    return t
            level = {t[:i] + t[i + 1:] for t in level for i in range(len(t)) if t[i] in "()"}
