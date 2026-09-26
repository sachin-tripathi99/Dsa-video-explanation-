from itertools import product

class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        def valid(s):
            bal = 0
            for c in s:
                bal += 1 if c == "(" else -1
                if bal < 0:
                    return False
            return bal == 0

        return ["".join(p) for p in product("()", repeat=2 * n) if valid(p)]
