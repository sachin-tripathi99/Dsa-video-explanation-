class Solution {
    int best(vector<int>& v, int i, int j) {
        if (j - i < 2) return 0;
        int res = INT_MAX;
        for (int k = i + 1; k < j; k++)                     // triangle (i, k, j)
            res = min(res, best(v, i, k) + best(v, k, j) + v[i] * v[k] * v[j]);
        return res;
    }
public:
    int minScoreTriangulation(vector<int>& values) {
        return best(values, 0, values.size() - 1);
    }
};
