class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        R, C = len(matrix), len(matrix[0])
        best = 0
        for r in range(R):
            for c in range(C):
                if matrix[r][c] != "1":
                    continue
                k = 1                           # grow while the new edge is all 1s
                while r + k < R and c + k < C and all(matrix[r + k][c + i] == "1" and matrix[r + i][c + k] == "1" for i in range(k + 1)):
                    k += 1
                best = max(best, k)
        return best * best
