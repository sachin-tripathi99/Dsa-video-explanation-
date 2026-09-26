class NumMatrix:
    def __init__(self, matrix: List[List[int]]):
        self.row = []                           # row[r][c] = sum of matrix[r][:c]
        for line in matrix:
            p = [0]
            for x in line:
                p.append(p[-1] + x)
            self.row.append(p)

    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        return sum(self.row[r][col2 + 1] - self.row[r][col1] for r in range(row1, row2 + 1))
