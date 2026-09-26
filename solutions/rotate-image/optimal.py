class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        for r in range(n):                      # transpose
            for c in range(r + 1, n):
                matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
        for row in matrix:                      # reverse each row
            row.reverse()
