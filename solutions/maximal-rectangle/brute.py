class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        m, n = len(matrix), len(matrix[0])
        S = [[0] * (n + 1) for _ in range(m + 1)]  # 2D prefix sums of ones
        for r in range(m):
            for c in range(n):
                S[r + 1][c + 1] = (matrix[r][c] == "1") + S[r][c + 1] + S[r + 1][c] - S[r][c]
        best = 0
        for r1 in range(m):
            for c1 in range(n):
                for r2 in range(r1, m):
                    for c2 in range(c1, n):
                        area = (r2 - r1 + 1) * (c2 - c1 + 1)
                        if S[r2 + 1][c2 + 1] - S[r1][c2 + 1] - S[r2 + 1][c1] + S[r1][c1] == area:
                            best = max(best, area)
        return best
