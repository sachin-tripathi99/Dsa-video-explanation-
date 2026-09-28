class Solution {
    vector<vector<int>> memo;
    int best(vector<int>& p, int i, int j) {
        int& m = memo[i][j];
        if (m >= 0) return m;                               // solved before
        int res = 0;
        for (int k = i + 1; k < j; k++) res = max(res, best(p, i, k) + best(p, k, j) + p[i] * p[k] * p[j]);
        return m = res;
    }
public:
    int maxCoins(vector<int>& nums) {
        vector<int> p = {1};
        p.insert(p.end(), nums.begin(), nums.end());
        p.push_back(1);
        memo.assign(p.size(), vector<int>(p.size(), -1));
        return best(p, 0, p.size() - 1);
    }
};
