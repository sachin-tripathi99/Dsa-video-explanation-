class Solution:
    def minFallingPathSum(self, matrix: List[List[int]]) -> int:
        n = len(matrix)
        prev = matrix[0][:]                     # best falls ending in the row above
        for r in range(1, n):
            prev = [matrix[r][c] + min(prev[max(0, c - 1):c + 2]) for c in range(n)]
        return min(prev)
