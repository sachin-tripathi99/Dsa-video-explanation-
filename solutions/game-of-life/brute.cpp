class Solution {
public:
    void gameOfLife(vector<vector<int>>& board) {
        int m = board.size(), n = board[0].size();
        vector<vector<int>> next(m, vector<int>(n, 0));
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                int live = 0;
                for (int dr = -1; dr <= 1; dr++)
                    for (int dc = -1; dc <= 1; dc++) {
                        int nr = r + dr, nc = c + dc;
                        if ((dr || dc) && nr >= 0 && nr < m && nc >= 0 && nc < n) live += board[nr][nc];
                    }
                next[r][c] = board[r][c] ? (live == 2 || live == 3) : (live == 3);
            }
        board = next;
    }
};
