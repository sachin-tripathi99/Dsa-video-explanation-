class Solution {
    vector<vector<string>> out;
    vector<string> path;
    vector<vector<bool>> pal;
    void go(const string& s, int i) {
        if (i == (int)s.size()) { out.push_back(path); return; }
        for (int j = i; j < (int)s.size(); j++) {
            if (!pal[i][j]) continue;                       // O(1) lookup
            path.push_back(s.substr(i, j - i + 1));
            go(s, j + 1);
            path.pop_back();
        }
    }
public:
    vector<vector<string>> partition(string s) {
        int n = s.size();
        pal.assign(n, vector<bool>(n, false));
        for (int len = 1; len <= n; len++)                  // shorter pieces first
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                pal[i][j] = s[i] == s[j] && (j - i < 2 || pal[i + 1][j - 1]);
            }
        go(s, 0);
        return out;
    }
};
