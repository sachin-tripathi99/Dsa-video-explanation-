class Solution {
    vector<vector<string>> out;
    vector<string> path;
    void go(const string& s, int i) {
        if (i == (int)s.size()) { out.push_back(path); return; }
        for (int j = i + 1; j <= (int)s.size(); j++) {
            string piece = s.substr(i, j - i);
            if (piece != string(piece.rbegin(), piece.rend())) continue;   // O(n) check
            path.push_back(piece);
            go(s, j);
            path.pop_back();
        }
    }
public:
    vector<vector<string>> partition(string s) {
        go(s, 0);
        return out;
    }
};
