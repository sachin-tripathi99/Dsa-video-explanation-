class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        out, q = [], []
        cols, d1, d2 = set(), set(), set()

        def go(r):
            if r == n:
                out.append(["." * c + "Q" + "." * (n - c - 1) for c in q])
                return
            for c in range(n):
                if c in cols or r - c in d1 or r + c in d2:
                    continue                    # attacked
                cols.add(c); d1.add(r - c); d2.add(r + c); q.append(c)
                go(r + 1)
                cols.remove(c); d1.remove(r - c); d2.remove(r + c); q.pop()

        go(0)
        return out
