class Solution {
    int best(vector<int>& c, int i, int j) {
        if (j - i < 2) return 0;
        int res = INT_MAX;
        for (int k = i + 1; k < j; k++) res = min(res, best(c, i, k) + best(c, k, j));   // first cut at c[k]
        return res + c[j] - c[i];
    }
public:
    int minCost(int n, vector<int>& cuts) {
        vector<int> c = cuts;
        c.push_back(0);
        c.push_back(n);
        sort(c.begin(), c.end());                           // 0, sorted cuts, n
        return best(c, 0, c.size() - 1);
    }
};
