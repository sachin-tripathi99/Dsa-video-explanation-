class Solution {
    int rows[9] = {0}, cols[9] = {0}, boxes[9] = {0};    // bit d = digit d used
    void flip(int r, int c, int d) {
        int bit = 1 << d;
        rows[r] ^= bit; cols[c] ^= bit; boxes[r / 3 * 3 + c / 3] ^= bit;
    }
    bool go(vector<vector<char>>& b) {
        int br = -1, bc = -1, bestMask = 0, bestCount = 10;
        for (int r = 0; r < 9; r++)                          // most constrained empty cell
            for (int c = 0; c < 9; c++) {
                if (b[r][c] != '.') continue;
                int mask = ~(rows[r] | cols[c] | boxes[r / 3 * 3 + c / 3]) & 0x3FE;
                int cnt = __builtin_popcount(mask);
                if (cnt < bestCount) { bestCount = cnt; br = r; bc = c; bestMask = mask; }
            }
        if (br == -1) return true;                           // solved
        for (int d = 1; d <= 9; d++) {
            if (!(bestMask >> d & 1)) continue;
            b[br][bc] = '0' + d; flip(br, bc, d);
            if (go(b)) return true;
            b[br][bc] = '.'; flip(br, bc, d);                // undo
        }
        return false;
    }
public:
    void solveSudoku(vector<vector<char>>& board) {
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++)
                if (board[r][c] != '.') flip(r, c, board[r][c] - '0');
        go(board);
    }
};
