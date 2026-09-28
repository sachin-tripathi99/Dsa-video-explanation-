class Solution {
    void mark(vector<vector<char>>& b, int r, int c) {
        if (r < 0 || c < 0 || r >= (int)b.size() || c >= (int)b[0].size() || b[r][c] != 'O') return;
        b[r][c] = 'S';                                      // reachable from the border
        mark(b, r + 1, c); mark(b, r - 1, c); mark(b, r, c + 1); mark(b, r, c - 1);
    }
public:
    void solve(vector<vector<char>>& board) {
        int m = board.size(), n = board[0].size();
        for (int r = 0; r < m; r++) { mark(board, r, 0); mark(board, r, n - 1); }   // border O cells
        for (int c = 0; c < n; c++) { mark(board, 0, c); mark(board, m - 1, c); }
        for (auto& row : board)
            for (char& x : row) x = x == 'S' ? 'O' : 'X';   // safe stays, the rest is captured
    }
};
