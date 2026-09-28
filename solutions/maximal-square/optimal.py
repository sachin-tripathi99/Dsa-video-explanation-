class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        C = len(matrix[0])
        row = [0] * (C + 1)                     # row[c + 1] = dp for column c
        best = 0
        for line in matrix:
            diag = 0                            # dp[r − 1][c − 1]
            for c in range(1, C + 1):
                up = row[c]
                row[c] = 1 + min(up, row[c - 1], diag) if line[c - 1] == "1" else 0
                diag = up
                best = max(best, row[c])
        return best * best
