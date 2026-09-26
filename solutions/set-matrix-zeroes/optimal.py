class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        first_row = any(x == 0 for x in matrix[0])
        first_col = any(matrix[r][0] == 0 for r in range(m))
        for r in range(1, m):                   # mark in row 0 / column 0
            for c in range(1, n):
                if matrix[r][c] == 0:
                    matrix[r][0] = matrix[0][c] = 0
        for r in range(1, m):                   # clear inner cells from the marks
            for c in range(1, n):
                if matrix[r][0] == 0 or matrix[0][c] == 0:
                    matrix[r][c] = 0
        if first_row:
            for c in range(n):
                matrix[0][c] = 0
        if first_col:
            for r in range(m):
                matrix[r][0] = 0
