class Solution {
    bool dfs(vector<vector<char>>& b, const string& w, int r, int c, int k) {
        if (r < 0 || c < 0 || r >= (int)b.size() || c >= (int)b[0].size() || b[r][c] != w[k]) return false;   // mismatch or used
        if (k == (int)w.size() - 1) return true;
        char saved = b[r][c];
        b[r][c] = '#';                                      // mark as used
        bool ok = dfs(b, w, r + 1, c, k + 1) || dfs(b, w, r - 1, c, k + 1)
               || dfs(b, w, r, c + 1, k + 1) || dfs(b, w, r, c - 1, k + 1);
        b[r][c] = saved;                                    // unmark
        return ok;
    }
public:
    bool exist(vector<vector<char>>& board, string word) {
        for (int r = 0; r < (int)board.size(); r++)
            for (int c = 0; c < (int)board[0].size(); c++)
                if (dfs(board, word, r, c, 0)) return true;
        return false;
    }
};
