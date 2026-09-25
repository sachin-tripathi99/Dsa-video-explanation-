class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        rows = [[1]]
        for r in range(1, numRows):
            prev = rows[-1]
            row = [1] + [prev[c - 1] + prev[c] for c in range(1, r)] + [1]  # two numbers above
            rows.append(row)
        return rows
