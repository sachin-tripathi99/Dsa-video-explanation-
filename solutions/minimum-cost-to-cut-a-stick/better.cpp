class Solution {
    vector<vector<int>> memo;
    int best(vector<int>& c, int i, int j) {
        if (j - i < 2) return 0;
        int& m = memo[i][j];
        if (m >= 0) return m;                               // solved before
        int res = INT_MAX;
        for (int k = i + 1; k < j; k++) res = min(res, best(c, i, k) + best(c, k, j));
        return m = res + c[j] - c[i];
    }
public:
    int minCost(int n, vector<int>& cuts) {
        vector<int> c = cuts;
        c.push_back(0);
        c.push_back(n);
        sort(c.begin(), c.end());
        memo.assign(c.size(), vector<int>(c.size(), -1));
        return best(c, 0, c.size() - 1);
    }
};
