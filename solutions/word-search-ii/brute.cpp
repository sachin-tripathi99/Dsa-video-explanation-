class Solution {
    bool dfs(vector<vector<char>>& b, const string& w, int r, int c, int i) {
        if (i == (int)w.size()) return true;
        if (r < 0 || c < 0 || r >= (int)b.size() || c >= (int)b[0].size() || b[r][c] != w[i]) return false;
        char tmp = b[r][c];
        b[r][c] = '#';                                      // mark used
        bool ok = dfs(b, w, r + 1, c, i + 1) || dfs(b, w, r - 1, c, i + 1) || dfs(b, w, r, c + 1, i + 1) || dfs(b, w, r, c - 1, i + 1);
        b[r][c] = tmp;
        return ok;
    }
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        vector<string> res;
        for (auto& w : words) {                             // a full search per word
            bool found = false;
            for (int r = 0; r < (int)board.size() && !found; r++)
                for (int c = 0; c < (int)board[0].size() && !found; c++)
                    found = dfs(board, w, r, c, 0);
            if (found) res.push_back(w);
        }
        return res;
    }
};
