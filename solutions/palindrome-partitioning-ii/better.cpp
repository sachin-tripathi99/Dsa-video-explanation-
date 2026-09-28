class Solution {
    vector<int> memo;
    bool isPal(const string& s, int l, int r) {
        while (l < r) if (s[l++] != s[r--]) return false;
        return true;
    }
    int cuts(const string& s, int i) {
        if (isPal(s, i, s.size() - 1)) return 0;
        if (memo[i] >= 0) return memo[i];                   // solved before
        int best = INT_MAX;
        for (int j = i; j < (int)s.size() - 1; j++)
            if (isPal(s, i, j)) best = min(best, 1 + cuts(s, j + 1));
        return memo[i] = best;
    }
public:
    int minCut(string s) {
        memo.assign(s.size(), -1);
        return cuts(s, 0);
    }
};
