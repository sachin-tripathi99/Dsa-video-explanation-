class Solution {
    vector<vector<char>>* b;
    string w, path;
    vector<vector<bool>> used;
    bool walk(int r, int c) {                               // build a whole path, compare only at the end
        auto& g = *b;
        if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || used[r][c]) return false;
        path.push_back(g[r][c]);
        used[r][c] = true;
        bool ok;
        if (path.size() == w.size()) ok = path == w;
        else ok = walk(r + 1, c) || walk(r - 1, c) || walk(r, c + 1) || walk(r, c - 1);
        used[r][c] = false;
        path.pop_back();
        return ok;
    }
public:
    bool exist(vector<vector<char>>& board, string word) {
        b = &board; w = word;
        used.assign(board.size(), vector<bool>(board[0].size(), false));
        for (int r = 0; r < (int)board.size(); r++)
            for (int c = 0; c < (int)board[0].size(); c++)
                if (walk(r, c)) return true;
        return false;
    }
};
