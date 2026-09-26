class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        out = [[0] * n for _ in range(n)]
        for r in range(n):
            for c in range(n):
                out[c][n - 1 - r] = matrix[r][c]
        matrix[:] = out
