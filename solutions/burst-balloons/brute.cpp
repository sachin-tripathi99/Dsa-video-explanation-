class Solution {
    int best(vector<int>& p, int i, int j) {                // burst everything strictly between i and j
        int res = 0;
        for (int k = i + 1; k < j; k++)                     // k bursts last
            res = max(res, best(p, i, k) + best(p, k, j) + p[i] * p[k] * p[j]);
        return res;
    }
public:
    int maxCoins(vector<int>& nums) {
        vector<int> p = {1};
        p.insert(p.end(), nums.begin(), nums.end());
        p.push_back(1);
        return best(p, 0, p.size() - 1);
    }
};
