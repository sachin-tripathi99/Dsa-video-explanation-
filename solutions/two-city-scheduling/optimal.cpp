class Solution {
public:
    int twoCitySchedCost(vector<vector<int>>& costs) {
        sort(costs.begin(), costs.end(), [](auto& a, auto& b) { return a[0] - a[1] < b[0] - b[1]; });   // most "A-friendly" first
        int n = costs.size() / 2, total = 0;
        for (int i = 0; i < (int)costs.size(); i++) total += i < n ? costs[i][0] : costs[i][1];
        return total;
    }
};
