class Solution {
public:
    vector<vector<int>> combine(int n, int k) {
        vector<vector<int>> out;
        for (int mask = 0; mask < (1 << n); mask++) {
            if (__builtin_popcount(mask) != k) continue;    // wrong size
            vector<int> c;
            for (int i = 0; i < n; i++) if (mask >> i & 1) c.push_back(i + 1);
            out.push_back(c);
        }
        return out;
    }
};
