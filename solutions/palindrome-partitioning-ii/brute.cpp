class Solution {
    bool isPal(const string& s, int l, int r) {
        while (l < r) if (s[l++] != s[r--]) return false;
        return true;
    }
    int cuts(const string& s, int i) {                      // fewest cuts for s[i:]
        if (isPal(s, i, s.size() - 1)) return 0;
        int best = INT_MAX;
        for (int j = i; j < (int)s.size() - 1; j++)
            if (isPal(s, i, j)) best = min(best, 1 + cuts(s, j + 1));   // first piece s[i..j]
        return best;
    }
public:
    int minCut(string s) {
        return cuts(s, 0);
    }
};
