class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        def ok(cells):
            digits = [d for d in cells if d != "."]
            return len(digits) == len(set(digits))

        rows = all(ok(board[r]) for r in range(9))
        cols = all(ok([board[r][c] for r in range(9)]) for c in range(9))
        boxes = all(ok([board[br + i][bc + j] for i in range(3) for j in range(3)])
                    for br in (0, 3, 6) for bc in (0, 3, 6))
        return rows and cols and boxes
