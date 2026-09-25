class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        rows = []
        for r in range(numRows):
            row = []
            for c in range(r + 1):
                v = 1
                for k in range(1, c + 1):
                    v = v * (r - k + 1) // k        # C(r, c)
                row.append(v)
            rows.append(row)
        return rows
