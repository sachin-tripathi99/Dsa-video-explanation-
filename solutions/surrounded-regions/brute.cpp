class Solution {
    bool escapes(vector<vector<char>>& b, int sr, int sc) {   // fresh search per cell
        int m = b.size(), n = b[0].size();
        vector<vector<bool>> seen(m, vector<bool>(n, false));
        queue<pair<int, int>> q;
        q.push({sr, sc});
        seen[sr][sc] = true;
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            if (r == 0 || c == 0 || r == m - 1 || c == n - 1) return true;
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (nr < 0 || nc < 0 || nr >= m || nc >= n || seen[nr][nc] || b[nr][nc] != 'O') continue;
                seen[nr][nc] = true;
                q.push({nr, nc});
            }
        }
        return false;
    }
public:
    void solve(vector<vector<char>>& board) {
        vector<pair<int, int>> capture;
        for (int r = 0; r < (int)board.size(); r++)
            for (int c = 0; c < (int)board[0].size(); c++)
                if (board[r][c] == 'O' && !escapes(board, r, c)) capture.push_back({r, c});
        for (auto [r, c] : capture) board[r][c] = 'X';
    }
};
