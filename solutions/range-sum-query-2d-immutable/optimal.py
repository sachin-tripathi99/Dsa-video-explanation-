class NumMatrix:
    def __init__(self, matrix: List[List[int]]):
        R, C = len(matrix), len(matrix[0])
        self.S = [[0] * (C + 1) for _ in range(R + 1)]   # S[i][j] = top-left i × j block
        for r in range(R):
            for c in range(C):
                self.S[r + 1][c + 1] = matrix[r][c] + self.S[r][c + 1] + self.S[r + 1][c] - self.S[r][c]

    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        S = self.S
        return S[row2 + 1][col2 + 1] - S[row1][col2 + 1] - S[row2 + 1][col1] + S[row1][col1]
