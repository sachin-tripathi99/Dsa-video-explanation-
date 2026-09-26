class Solution {
public:
    vector<vector<int>> combinationSum3(int k, int n) {
        vector<vector<int>> out;
        for (int mask = 0; mask < (1 << 9); mask++) {
            if (__builtin_popcount(mask) != k) continue;
            int sum = 0;
            vector<int> c;
            for (int i = 0; i < 9; i++) if (mask >> i & 1) { sum += i + 1; c.push_back(i + 1); }
            if (sum == n) out.push_back(c);
        }
        return out;
    }
};
