class Solution {
    vector<vector<int>> memo;
    int best(vector<int>& v, int i, int j) {
        if (j - i < 2) return 0;
        int& m = memo[i][j];
        if (m) return m;                                    // solved before
        int res = INT_MAX;
        for (int k = i + 1; k < j; k++) res = min(res, best(v, i, k) + best(v, k, j) + v[i] * v[k] * v[j]);
        return m = res;
    }
public:
    int minScoreTriangulation(vector<int>& values) {
        memo.assign(values.size(), vector<int>(values.size(), 0));
        return best(values, 0, values.size() - 1);
    }
};
