class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        rows, cols, boxes = [0] * 9, [0] * 9, [0] * 9   # bit d = digit d used

        def flip(r, c, d):
            bit = 1 << d
            rows[r] ^= bit
            cols[c] ^= bit
            boxes[r // 3 * 3 + c // 3] ^= bit

        for r in range(9):
            for c in range(9):
                if board[r][c] != ".":
                    flip(r, c, int(board[r][c]))

        def go():
            best, best_mask, best_cnt = None, 0, 10
            for r in range(9):                  # most constrained empty cell
                for c in range(9):
                    if board[r][c] == ".":
                        mask = ~(rows[r] | cols[c] | boxes[r // 3 * 3 + c // 3]) & 0x3FE
                        cnt = bin(mask).count("1")
                        if cnt < best_cnt:
                            best, best_mask, best_cnt = (r, c), mask, cnt
            if best is None:
                return True                     # solved
            r, c = best
            for d in range(1, 10):
                if best_mask >> d & 1:
                    board[r][c] = str(d)
                    flip(r, c, d)
                    if go():
                        return True
                    board[r][c] = "."
                    flip(r, c, d)               # undo
            return False

        go()
