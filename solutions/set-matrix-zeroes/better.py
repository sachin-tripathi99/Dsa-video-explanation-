class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        rows = {r for r in range(m) for c in range(n) if matrix[r][c] == 0}
        cols = {c for r in range(m) for c in range(n) if matrix[r][c] == 0}
        for r in range(m):
            for c in range(n):
                if r in rows or c in cols:
                    matrix[r][c] = 0
