class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        def ok(r, c, d):                        # scan row, column and box
            for k in range(9):
                if board[r][k] == d or board[k][c] == d:
                    return False
                if board[3 * (r // 3) + k // 3][3 * (c // 3) + k % 3] == d:
                    return False
            return True

        def go():
            for r in range(9):
                for c in range(9):
                    if board[r][c] != ".":
                        continue                # first empty cell
                    for d in "123456789":
                        if ok(r, c, d):
                            board[r][c] = d
                            if go():
                                return True
                            board[r][c] = "."   # undo
                    return False
            return True

        go()
