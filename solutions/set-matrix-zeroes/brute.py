class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        copy = [row[:] for row in matrix]
        for r in range(m):
            for c in range(n):
                if copy[r][c] == 0:
                    for k in range(n):
                        matrix[r][k] = 0
                    for k in range(m):
                        matrix[k][c] = 0
