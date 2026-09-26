from itertools import permutations

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        out = []
        for q in permutations(range(n)):        # one queen per row and column
            if all(abs(q[a] - q[b]) != b - a for a in range(n) for b in range(a + 1, n)):
                out.append(["." * c + "Q" + "." * (n - c - 1) for c in q])
        return out
